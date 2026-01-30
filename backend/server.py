from fastapi import FastAPI, APIRouter, HTTPException, Depends, Path
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pathlib import Path as FilePath
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import jwt, JWTError
import uuid
import os
import logging
import razorpay
import hmac
import hashlib

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

ROOT_DIR = FilePath(__file__).parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
SECRET_KEY = os.environ["JWT_SECRET_KEY"]
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "")

RAZORPAY_KEY_ID = os.environ["RAZORPAY_KEY_ID"]
RAZORPAY_KEY_SECRET = os.environ["RAZORPAY_KEY_SECRET"]

MAIL_USERNAME = os.environ["MAIL_USERNAME"]
MAIL_PASSWORD = os.environ["MAIL_PASSWORD"]
MAIL_FROM = os.environ["MAIL_FROM"]
MAIL_SERVER = os.environ["MAIL_SERVER"]
MAIL_PORT = int(os.environ["MAIL_PORT"])
ADMIN_EMAIL = os.environ["ADMIN_EMAIL"]

origins = [o.strip() for o in CORS_ORIGINS.split(",") if o.strip()]

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

razorpay_client = razorpay.Client(
    auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
)

mail_conf = ConnectionConfig(
    MAIL_USERNAME=MAIL_USERNAME,
    MAIL_PASSWORD=MAIL_PASSWORD,
    MAIL_FROM=MAIL_FROM,
    MAIL_SERVER=MAIL_SERVER,
    MAIL_PORT=MAIL_PORT,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)


app = FastAPI(title="Agriculture API")
api_router = APIRouter(prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= AUTH =================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str):
    return pwd_context.verify(password, hashed)


def create_access_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user = await db.users.find_one({"id": payload.get("sub")}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ================= MODELS =================
class UserRole:
    FARMER = "farmer"
    BUYER = "buyer"
    ADMIN = "admin"


class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: EmailStr
    name: str
    role: str
    phone: Optional[str]
    location: Optional[str]
    created_at: datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str
    phone: Optional[str] = None
    location: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User


class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    description: str
    category: str
    price: float
    quantity: float
    unit: str
    farmer_id: str
    farmer_name: str
    location: str
    image_url: Optional[str]
    available: bool
    created_at: datetime


class ProductCreate(BaseModel):
    name: str
    description: str
    category: str
    price: float
    quantity: float
    unit: str
    location: str
    image_url: Optional[str] = None


class OrderItem(BaseModel):
    product_id: str
    product_name: str
    quantity: float
    unit: str
    price: float
    total: float


class OrderCreate(BaseModel):
    items: List[OrderItem]
    delivery_address: str
    payment_method: str


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    buyer_id: str
    buyer_name: str
    buyer_email: str
    farmer_id: str
    farmer_name: str
    items: List[OrderItem]
    total_amount: float
    status: str
    delivery_address: str
    payment_method: str
    created_at: datetime


class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str


# ================= ROUTES =================
@api_router.get("/")
async def root():
    return {"message": "Agriculture API running"}


# -------- AUTH --------
@api_router.post("/auth/register", response_model=TokenResponse)
async def register(data: UserCreate):
    if await db.users.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    user = {
        "id": str(uuid.uuid4()),
        "email": data.email,
        "name": data.name,
        "role": data.role,
        "phone": data.phone,
        "location": data.location,
        "password": hash_password(data.password),
        "created_at": datetime.now(timezone.utc),
    }

    await db.users.insert_one(user)

    token = create_access_token({"sub": user["id"], "role": user["role"]})
    user.pop("password")

    return {"access_token": token, "user": user}


@api_router.post("/auth/login", response_model=TokenResponse)
async def login(data: UserLogin):
    user = await db.users.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user["id"], "role": user["role"]})
    user.pop("password")
    user.pop("_id", None)

    return {"access_token": token, "user": user}


@api_router.get("/auth/me", response_model=User)
async def me(current_user=Depends(get_current_user)):
    return current_user


# -------- PRODUCTS --------
@api_router.get("/products", response_model=List[Product])
async def get_products():
    return await db.products.find({"available": True}, {"_id": 0}).to_list(1000)


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@api_router.post("/products", response_model=Product)
async def create_product(data: ProductCreate, user=Depends(get_current_user)):
    if user["role"] != UserRole.FARMER:
        raise HTTPException(status_code=403, detail="Only farmers can add products")

    product = {
        "id": str(uuid.uuid4()),
        **data.model_dump(),
        "farmer_id": user["id"],
        "farmer_name": user["name"],
        "available": True,
        "created_at": datetime.now(timezone.utc),
    }

    await db.products.insert_one(product)
    return product


@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, user=Depends(get_current_user)):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if user["role"] != UserRole.ADMIN and product["farmer_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    await db.products.delete_one({"id": product_id})
    return {"message": "Product deleted successfully"}


# -------- ORDERS --------
@api_router.post("/orders", response_model=Order)
async def create_order(data: OrderCreate, user=Depends(get_current_user)):
    if user["role"] != UserRole.BUYER:
        raise HTTPException(status_code=403, detail="Only buyers can create orders")

    total = sum(item.total for item in data.items)
    product = await db.products.find_one({"id": data.items[0].product_id})

    order = {
        "id": str(uuid.uuid4()),
        "buyer_id": user["id"],
        "buyer_name": user["name"],
        "buyer_email": user["email"],
        "farmer_id": product["farmer_id"],
        "farmer_name": product["farmer_name"],
        "items": [item.model_dump() for item in data.items],
        "total_amount": total,
        "status": "pending",
        "delivery_address": data.delivery_address,
        "payment_method": data.payment_method,
        "created_at": datetime.now(timezone.utc),
    }

    await db.orders.insert_one(order)
    return order


@api_router.get("/orders", response_model=List[Order])
async def get_orders(user=Depends(get_current_user)):
    if user["role"] == UserRole.BUYER:
        q = {"buyer_id": user["id"]}
    elif user["role"] == UserRole.FARMER:
        q = {"farmer_id": user["id"]}
    else:
        q = {}

    return await db.orders.find(q, {"_id": 0}).to_list(1000)


@api_router.put("/orders/{order_id}/status")
async def update_order_status(order_id: str, status: str, user=Depends(get_current_user)):
    await db.orders.update_one({"id": order_id}, {"$set": {"status": status}})
    return {"message": "Order status updated"}


# -------- RAZORPAY --------
@api_router.post("/payments/create-order")
async def create_razorpay_order():
    order = razorpay_client.order.create({
        "amount": 50000,
        "currency": "INR",
        "payment_capture": 1
    })
    return {
        "order_id": order["id"],
        "amount": order["amount"],
        "key": RAZORPAY_KEY_ID
    }


@api_router.post("/payments/verify")
async def verify_payment(data: dict):
    msg = f"{data['razorpay_order_id']}|{data['razorpay_payment_id']}"
    signature = hmac.new(
        RAZORPAY_KEY_SECRET.encode(),
        msg.encode(),
        hashlib.sha256
    ).hexdigest()

    if signature != data["razorpay_signature"]:
        raise HTTPException(status_code=400, detail="Payment verification failed")

    return {"success": True}

@api_router.post("/contact")
async def contact(data: ContactMessageCreate):
    # 1. Save to MongoDB
    await db.contact_messages.insert_one({
        "id": str(uuid.uuid4()),
        **data.model_dump(),
        "created_at": datetime.now(timezone.utc)
    })

    fm = FastMail(mail_conf)
    current_year = datetime.now().year
    timestamp = datetime.now().strftime("%d %b %Y, %I:%M %p")

    # ================= ADMIN EMAIL (Forest & Professional) =================
    admin_html = f"""
    <div style="background:#F0F4F1;padding:40px 10px;font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <div style="max-width:620px;margin:auto;background:#ffffff;border-radius:16px;box-shadow:0 15px 40px rgba(22, 66, 60, 0.1);overflow:hidden;border: 1px solid #E1E8E3;">
        
        <div style="background:linear-gradient(135deg, #16423C, #6A9C89);padding:30px;color:white;text-align:left;">
          <h1 style="margin:0;font-size:22px;letter-spacing:0.5px;">🌿 New Marketplace Inquiry</h1>
          <p style="margin:6px 0 0;font-size:14px;opacity:0.9;">Priority: Support Required</p>
        </div>

        <div style="padding:32px;color:#2D3436;">
          <h3 style="color:#16423C;margin-top:0;border-bottom:2px solid #F0F4F1;padding-bottom:10px;">User Details</h3>
          <table style="width:100%;font-size:15px;border-collapse:collapse;">
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #F0F0F0;color:#636E72;width:100px;"><strong>👤 Name</strong></td>
              <td style="padding:12px 0;border-bottom:1px solid #F0F0F0;color:#1A202C;">{data.name}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #F0F0F0;color:#636E72;"><strong>📧 Email</strong></td>
              <td style="padding:12px 0;border-bottom:1px solid #F0F0F0;"><a href="mailto:{data.email}" style="color:#6A9C89;text-decoration:none;">{data.email}</a></td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #F0F0F0;color:#636E72;"><strong>📞 Phone</strong></td>
              <td style="padding:12px 0;border-bottom:1px solid #F0F0F0;color:#1A202C;">{data.phone}</td>
            </tr>
          </table>

          <div style="margin-top:30px;padding:20px;background:#F9FBF9;border-radius:12px;border-left:5px solid #C6972E;">
            <strong style="color:#16423C;display:block;margin-bottom:10px;font-size:16px;">💬 Message Content</strong>
            <p style="margin:0;font-size:15px;line-height:1.7;color:#4A4A4A;">{data.message}</p>
          </div>
        </div>

        <div style="background:#F1F5F2;padding:15px;text-align:center;font-size:12px;color:#6A9C89;font-weight:bold;">
          🕒 System Timestamp: {timestamp}
        </div>
      </div>
    </div>
    """

    # ================= USER EMAIL (Warm & Welcoming) =================
    # Primary Color: #22C55E (Growth Green) | Info Box: #2563EB (Trust Blue)
    user_html = f"""
    <div style="background:#F7F9F7;padding:40px 10px;font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <div style="max-width:620px;margin:auto;background:#ffffff;border-radius:20px;box-shadow:0 20px 50px rgba(0,0,0,0.05);overflow:hidden;">
        
        <div style="background:linear-gradient(135deg, #22C55E, #16A34A);padding:45px 30px;text-align:center;color:white;">
          <div style="background:rgba(255,255,255,0.2);width:70px;height:70px;line-height:75px;border-radius:50%;margin:0 auto 20px;font-size:35px;">🌱</div>
          <h1 style="margin:0;font-size:26px;">Message Received!</h1>
          <p style="margin-top:10px;font-size:15px;opacity:0.9;">Thank you for reaching out to AgriSmart</p>
        </div>

        <div style="padding:40px;color:#2D3436;">
          <p style="font-size:16px;">Hi <strong>{data.name}</strong>,</p>
          <p style="font-size:15px;line-height:1.8;color:#4B5563;">
            We've successfully received your inquiry regarding <strong>"{data.subject}"</strong>. Our team of agricultural specialists is currently reviewing your details.
          </p>

          <div style="margin:30px 0;padding:20px;background:#F0F7FF;border-radius:12px;border-left:5px solid #2563EB;display:flex;align-items:center;">
            <p style="margin:0;font-size:14px;color:#1E40AF;">
              ⏱ <strong>Estimated Response:</strong> Our experts usually reply within <strong>24 hours</strong>.
            </p>
          </div>

          <p style="margin-top:40px;font-size:15px;color:#16423C;">
            Best Regards,<br>
            <strong style="font-size:17px;">AgriSmart Support Team</strong>
          </p>
        </div>

        <div style="background:#16423C;padding:25px;text-align:center;font-size:12px;color:#ffffff;opacity:0.8;">
          © {current_year} AgriSmart Marketplace • Empowering Local Farmers
          <br><br>
          <div style="font-size:10px;opacity:0.6;">This is an automated confirmation. Please do not reply directly to this email.</div>
        </div>
      </div>
    </div>
    """

    # 2. Send Admin Notification
    await fm.send_message(
        MessageSchema(
            subject=f"📩 New Contact: {data.subject}",
            recipients=[ADMIN_EMAIL],
            body=admin_html,
            subtype="html",
        )
    )

    # 3. Send User Confirmation
    await fm.send_message(
        MessageSchema(
            subject="✅ We received your message - AgriSmart",
            recipients=[data.email],
            body=user_html,
            subtype="html",
        )
    )

    return {"message": "Message sent successfully"}



# ================= FINAL =================
app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown():
    client.close()
    

logging.basicConfig(level=logging.INFO)
