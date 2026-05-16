from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from datetime import datetime
from .db import Base


# 👤 USER
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)


# ⚡🔥 CONSUMPTION
class Consumption(Base):
    __tablename__ = "consumptions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    valoare = Column(Float)

    tip = Column(String)

    # LUNA + AN
    luna = Column(Integer)

    an = Column(Integer)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )