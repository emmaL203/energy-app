from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta, date

from app.db import get_db, engine
from app.models import Base, User, Consumption
from app.security import verify_password, get_password_hash

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔧 creează tabelele
Base.metadata.create_all(bind=engine)

# 🔐 CONFIG JWT
import os

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# 🔑 CREATE TOKEN
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# 👤 REGISTER
@app.post("/register")
def register(email: str, password: str, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email deja exista")

    user = User(
        email=email,
        password=get_password_hash(password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User creat"}


# 🔐 LOGIN
@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user:
        raise HTTPException(status_code=400, detail="User nu exista")

    if not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Parola gresita")

    token = create_access_token({"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# 👤 GET CURRENT USER
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")

        if email is None:
            raise HTTPException(status_code=401, detail="Token invalid")

        return email

    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalid")


# ➕ ADD CONSUMPTION (electricitate + gaz)
@app.post("/add-consumption")
def add_consumption(
    valoare: float,
    tip: str,
    data: date,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    user = db.query(User).filter(User.email == current_user).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    consum = Consumption(
        user_id=user.id,
        valoare=valoare,
        tip=tip,
        data=data
    )

    db.add(consum)
    db.commit()
    db.refresh(consum)

    return {"message": "Consum adaugat"}


# 📊 GET CONSUMPTIONS (doar ale userului)
@app.get("/consumptions")
def get_consumptions(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    user = db.query(User).filter(User.email == current_user).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    consum = db.query(Consumption).filter(Consumption.user_id == user.id).all()

    return consum


# 👤 TEST AUTH
@app.get("/me")
def read_users_me(current_user: str = Depends(get_current_user)):
    return {"email": current_user}

@app.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    user = db.query(User).filter(User.email == current_user).first()

    consum = db.query(Consumption).filter(Consumption.user_id == user.id).all()

    total = sum(c.valoare for c in consum)

    electricitate = sum(c.valoare for c in consum if c.tip == "electricitate")
    gaz = sum(c.valoare for c in consum if c.tip == "gaz")

    return {
        "total_consum": total,
        "electricitate": electricitate,
        "gaz": gaz
    }

@app.get("/consumption-by-date")
def consumption_by_date(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    user = db.query(User).filter(User.email == current_user).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    consum = db.query(Consumption).filter(Consumption.user_id == user.id).all()

    result = {}

    for c in consum:
        data_str = str(c.data)

        if data_str not in result:
            result[data_str] = 0

        result[data_str] += c.valoare

    return result


@app.get("/consumption-by-type")
def consumption_by_type(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    user = db.query(User).filter(User.email == current_user).first()

    consum = db.query(Consumption).filter(Consumption.user_id == user.id).all()

    electricitate = sum(c.valoare for c in consum if c.tip == "electricitate")
    gaz = sum(c.valoare for c in consum if c.tip == "gaz")

    return {
        "electricitate": electricitate,
        "gaz": gaz
    }

@app.get("/alerts")
def get_alerts(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    user = db.query(User).filter(User.email == current_user).first()

    consum = db.query(Consumption).filter(Consumption.user_id == user.id).all()

    if len(consum) < 2:
        return {"message": "Nu sunt suficiente date"}

    last = consum[-1].valoare
    prev = consum[-2].valoare

    if last > prev * 1.2:
        return {"alert": "Consum crescut cu peste 20%!"}

    return {"alert": "Consum normal"}

@app.get("/average-consumption")
def average_consumption(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    user = db.query(User).filter(User.email == current_user).first()

    consum = db.query(Consumption).filter(Consumption.user_id == user.id).all()

    if not consum:
        return {"average": 0}

    avg = sum(c.valoare for c in consum) / len(consum)

    return {"average": avg}