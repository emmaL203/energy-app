from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from .db import Base


# 👤 USER
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)


# ⚡🔥 CONSUMPTION (energie + gaz)
class Consumption(Base):
    __tablename__ = "consumptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    valoare = Column(Float)
    tip = Column(String)  # "electricitate" sau "gaz"
    data = Column(Date)