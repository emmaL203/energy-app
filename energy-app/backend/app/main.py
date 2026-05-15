import os
import re
import traceback

from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session

from jose import JWTError, jwt

from datetime import datetime, timedelta, date

from app.db import get_db, engine
from app.models import Base, User, Consumption
from app.security import verify_password, get_password_hash


try:
    print("🚀 STARTING APP...")
except Exception as e:
    print("❌ START ERROR:", e)
    traceback.print_exc()

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ creează tabelele
@app.on_event("startup")
def startup_event():
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ DB READY")
    except Exception as e:
        print("❌ DB ERROR:", e)


# 🔐 ENV
SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    print("⚠️ SECRET_KEY lipseste - folosesc fallback")
    SECRET_KEY = "fallback_secret"

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# 🔑 TOKEN
def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


# 👤 REGISTER
@app.post("/register")
def register(email: str, password: str, db: Session = Depends(get_db)):

    # ✅ validare email
    email_regex = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

    if not re.match(email_regex, email):
        raise HTTPException(
            status_code=400,
            detail="Email invalid"
        )

    existing_user = db.query(User).filter(
        User.email == email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email deja exista"
        )

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
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not user:
        raise HTTPException(
            status_code=400,
            detail="User nu exista"
        )

    if not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=400,
            detail="Parola gresita"
        )

    token = create_access_token({
        "sub": user.email
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# 👤 CURRENT USER
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")

        if email is None:
            raise HTTPException(
                status_code=401,
                detail="Token invalid"
            )

        return email

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Token invalid"
        )


# 📊 STATS
@app.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    user = db.query(User).filter(
        User.email == current_user
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    consum = db.query(Consumption).filter(
        Consumption.user_id == user.id
    ).all()

    total = sum(c.valoare for c in consum)

    electricitate = sum(
        c.valoare
        for c in consum
        if c.tip == "electricitate"
    )

    gaz = sum(
        c.valoare
        for c in consum
        if c.tip == "gaz"
    )

    return {
        "total_consum": total,
        "electricitate": electricitate,
        "gaz": gaz
    }


# ➕ ADD CONSUMPTION
@app.post("/add-consumption")
def add_consumption(
    valoare: float,
    tip: str,
    data: date,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    user = db.query(User).filter(
        User.email == current_user
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

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


# 📊 GET CONSUMPTIONS
@app.get("/consumptions")
def get_consumptions(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    user = db.query(User).filter(
        User.email == current_user
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    consum = db.query(Consumption).filter(
        Consumption.user_id == user.id
    ).all()

    return consum


# 🧪 TEST API
@app.get("/")
def root():
    return {"message": "API LIVE 🚀"}