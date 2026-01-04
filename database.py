from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import os

Base = declarative_base()
DB_NAME = 'credential_manager.db'

# Determine DB path (use a volume in Docker)
if os.path.exists('/data'):
    DB_PATH = f'sqlite:////data/{DB_NAME}'
else:
    DB_PATH = f'sqlite:///{DB_NAME}'

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

class Credential(Base):
    __tablename__ = 'credentials'
    id = Column(Integer, primary_key=True)
    username = Column(String, ForeignKey('users.username'), nullable=False)
    service = Column(String, nullable=False)
    data = Column(Text, nullable=False) # Storing JSON as string

# Setup engine and session
engine = create_engine(DB_PATH, connect_args={'check_same_thread': False})
Session = sessionmaker(bind=engine)

def init_db():
    Base.metadata.create_all(engine)

def get_session():
    return Session()
