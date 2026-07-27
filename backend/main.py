import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import create_engine, Column, String, Float, Integer, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel, EmailStr
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./amazon_clone.db")
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key-change-me")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

app = FastAPI(title="Amazon Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserDB(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True)
    hashed_password = Column(String)

class ProductDB(Base):
    __tablename__ = "products"
    id = Column(String, primary_key=True)
    title = Column(String)
    price = Column(Float)
    description = Column(Text)
    category = Column(String)
    image = Column(String)
    rating_rate = Column(Float, default=0)
    rating_count = Column(Integer, default=0)

class OrderDB(Base):
    __tablename__ = "orders"
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    items = Column(Text)
    total = Column(Float)
    address = Column(Text)
    status = Column(String, default="pending")
    created_at = Column(String, default=lambda: datetime.utcnow().isoformat())

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_token(data: dict):
    expire = datetime.utcnow() + timedelta(days=7)
    return jwt.encode({**data, "exp": expire}, SECRET_KEY, algorithm="HS256")

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        user = db.query(UserDB).filter(UserDB.id == payload["sub"]).first()
        if not user: raise HTTPException(status_code=401)
        return user
    except JWTError:
        raise HTTPException(status_code=401)

# Seed products
def seed_products(db: Session):
    if db.query(ProductDB).count() > 0:
        return
    products = [
        {"id": "1", "title": "Wireless Bluetooth Headphones", "price": 29.99, "description": "Premium sound quality with noise cancellation. 30-hour battery life.", "category": "Electronics", "image": "https://via.placeholder.com/300", "rating_rate": 4.5, "rating_count": 120},
        {"id": "2", "title": "Mechanical Gaming Keyboard", "price": 59.99, "description": "RGB backlit mechanical keyboard with blue switches.", "category": "Electronics", "image": "https://via.placeholder.com/300", "rating_rate": 4.2, "rating_count": 85},
        {"id": "3", "title": "Ergonomic Office Chair", "price": 199.99, "description": "Lumbar support, adjustable height, mesh back.", "category": "Furniture", "image": "https://via.placeholder.com/300", "rating_rate": 4.7, "rating_count": 200},
        {"id": "4", "title": "Stainless Steel Water Bottle", "price": 14.99, "description": "Double wall insulated, 24oz capacity.", "category": "Kitchen", "image": "https://via.placeholder.com/300", "rating_rate": 4.3, "rating_count": 310},
        {"id": "5", "title": "Running Shoes Pro", "price": 89.99, "description": "Lightweight, breathable, cushioned sole.", "category": "Sports", "image": "https://via.placeholder.com/300", "rating_rate": 4.6, "rating_count": 150},
        {"id": "6", "title": "LED Desk Lamp", "price": 34.99, "description": "Adjustable brightness, USB charging port.", "category": "Home", "image": "https://via.placeholder.com/300", "rating_rate": 4.1, "rating_count": 90},
        {"id": "7", "title": "Portable Power Bank 20000mAh", "price": 24.99, "description": "Fast charging, dual USB output.", "category": "Electronics", "image": "https://via.placeholder.com/300", "rating_rate": 4.4, "rating_count": 220},
        {"id": "8", "title": "Yoga Mat Premium", "price": 39.99, "description": "Non-slip surface, 6mm thick, eco-friendly.", "category": "Sports", "image": "https://via.placeholder.com/300", "rating_rate": 4.8, "rating_count": 175},
        {"id": "9", "title": "USB-C Hub Adapter", "price": 44.99, "description": "7-in-1 hub with HDMI, USB 3.0, SD card reader.", "category": "Electronics", "image": "https://via.placeholder.com/300", "rating_rate": 4.3, "rating_count": 160},
        {"id": "10", "title": "Air Purifier HEPA", "price": 129.99, "description": "True HEPA filter, covers 300 sq ft.", "category": "Home", "image": "https://via.placeholder.com/300", "rating_rate": 4.5, "rating_count": 95},
        {"id": "11", "title": "Laptop Stand Adjustable", "price": 27.99, "description": "Aluminum, foldable, ergonomic design.", "category": "Furniture", "image": "https://via.placeholder.com/300", "rating_rate": 4.4, "rating_count": 130},
        {"id": "12", "title": "Wireless Mouse Ergonomic", "price": 19.99, "description": "Silent clicks, adjustable DPI, long battery.", "category": "Electronics", "image": "https://via.placeholder.com/300", "rating_rate": 4.2, "rating_count": 250},
    ]
    for p in products:
        db.add(ProductDB(**p))
    db.commit()

@app.on_event("startup")
def startup():
    db = SessionLocal()
    seed_products(db)
    db.close()

# Auth schemas
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

@app.post("/api/auth/register")
def register(data: UserRegister, db: Session = Depends(get_db)):
    if db.query(UserDB).filter(UserDB.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    import uuid
    user = UserDB(id=str(uuid.uuid4()), name=data.name, email=data.email, hashed_password=pwd_context.hash(data.password))
    db.add(user)
    db.commit()
    token = create_token({"sub": user.id})
    return {"token": token, "user": {"id": user.id, "name": user.name, "email": user.email}}

@app.post("/api/auth/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.email == data.email).first()
    if not user or not pwd_context.verify(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"sub": user.id})
    return {"token": token, "user": {"id": user.id, "name": user.name, "email": user.email}}

# Products
@app.get("/api/products")
def get_products(category: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(ProductDB)
    if category: q = q.filter(ProductDB.category == category)
    products = q.all()
    return [{"id": p.id, "title": p.title, "price": p.price, "description": p.description, "category": p.category, "image": p.image, "rating": {"rate": p.rating_rate, "count": p.rating_count}} for p in products]

@app.get("/api/products/{product_id}")
def get_product(product_id: str, db: Session = Depends(get_db)):
    p = db.query(ProductDB).filter(ProductDB.id == product_id).first()
    if not p: raise HTTPException(status_code=404, detail="Not found")
    return {"id": p.id, "title": p.title, "price": p.price, "description": p.description, "category": p.category, "image": p.image, "rating": {"rate": p.rating_rate, "count": p.rating_count}}

@app.get("/api/products/search")
def search_products(q: str = "", db: Session = Depends(get_db)):
    products = db.query(ProductDB).filter(ProductDB.title.ilike(f"%{q}%") | ProductDB.description.ilike(f"%{q}%") | ProductDB.category.ilike(f"%{q}%")).all()
    return [{"id": p.id, "title": p.title, "price": p.price, "description": p.description, "category": p.category, "image": p.image, "rating": {"rate": p.rating_rate, "count": p.rating_count}} for p in products]

# Orders
class OrderCreate(BaseModel):
    items: list
    total: float
    address: str

@app.get("/api/orders")
def get_orders(user=Depends(get_current_user), db: Session = Depends(get_db)):
    import json
    orders = db.query(OrderDB).filter(OrderDB.user_id == user.id).order_by(OrderDB.created_at.desc()).all()
    return [{"id": o.id, "items": json.loads(o.items), "total": o.total, "address": o.address, "status": o.status, "createdAt": o.created_at} for o in orders]

@app.post("/api/orders")
def create_order(data: OrderCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    import json, uuid
    order = OrderDB(id=str(uuid.uuid4()), user_id=user.id, items=json.dumps(data.items), total=data.total, address=data.address)
    db.add(order)
    db.commit()
    return {"id": order.id, "status": order.status}

@app.get("/api/health")
def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}
