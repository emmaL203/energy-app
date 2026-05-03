import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta, date

from app.db import get_db, engine
from app.models import Base, User, Consumption
from app.security import verify_password, get_password_hash

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 DEBUG DB CONNECTION
try:
    Base.metadata.create_all(bind=engine)
    print("✅ DB CONNECTED OK")
except Exception as e:
    print("❌ DB ERROR:", e)
    raise e

# 🔐 ENV VARIABLES
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

if not SECRET_KEY:
    raise Exception("SECRET_KEY NU este setat!")

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


# 👤 CURRENT USER
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")

        if email is None:
            raise HTTPException(status_code=401, detail="Token invalid")

        return email

    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalid")


# ➕ ADD CONSUMPTION
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


# 📊 GET CONSUMPTIONS
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


# 🧪 TEST
@app.get("/")
def root():
    return {"message": "API LIVE 🚀"}