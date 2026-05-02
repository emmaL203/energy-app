from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 🔧 schimbă parola dacă e nevoie
DATABASE_URL = "postgresql://postgres:adinaema13@localhost:5432/energy_db"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# ✅ ASTA ÎȚI LIPSEA
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()