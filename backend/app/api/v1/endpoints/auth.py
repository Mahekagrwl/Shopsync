from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timezone
import uuid
from app.core.security import verify_password, get_password_hash, create_access_token, decode_access_token
from app.db.repository import db_store

router = APIRouter()

# In-memory users for authenticated sessions
USERS_DB = [
    {
        "id": "admin-1",
        "email": "admin@shopsync.beauty",
        "full_name": "Victoria Vance (Store Director)",
        "role": "admin",
        "hashed_password": get_password_hash("Admin@ShopSync2026"),
        "is_active": True,
        "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400"
    },
    {
        "id": "cust-8901",
        "email": "camille.laurent@example.com",
        "full_name": "Camille Laurent",
        "role": "customer",
        "hashed_password": get_password_hash("Beauty@1234"),
        "is_active": True,
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
    }
]

class UserRegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

@router.post("/register", response_model=TokenResponse)
async def register(req: UserRegisterRequest):
    # Check if user exists
    existing = next((u for u in USERS_DB if u["email"].lower() == req.email.lower()), None)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    user_id = f"cust-{uuid.uuid4().hex[:8]}"
    hashed_pwd = get_password_hash(req.password)

    new_user = {
        "id": user_id,
        "email": req.email.lower(),
        "full_name": req.full_name,
        "role": "customer",
        "phone": req.phone,
        "hashed_password": hashed_pwd,
        "is_active": True,
        "avatar_url": f"https://api.dicebear.com/7.x/initials/svg?seed={req.full_name}"
    }
    USERS_DB.append(new_user)

    # Also register in db_store.customers
    db_store.customers.append({
        "id": user_id,
        "full_name": req.full_name,
        "email": req.email.lower(),
        "phone": req.phone or "",
        "loyalty_tier": "Bronze Member",
        "loyalty_points": 100,
        "lifetime_spend": 0.0,
        "allergies": [],
        "skin_profile": {"skin_type": "Normal", "skin_concerns": []}
    })

    token = create_access_token(subject=user_id, role="customer")
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": new_user["email"],
            "full_name": new_user["full_name"],
            "role": new_user["role"],
            "avatar_url": new_user["avatar_url"]
        }
    }

@router.post("/login", response_model=TokenResponse)
async def login(req: UserLoginRequest):
    user = next((u for u in USERS_DB if u["email"].lower() == req.email.lower()), None)
    if not user or not verify_password(req.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please verify your email and password."
        )

    token = create_access_token(subject=user["id"], role=user["role"])
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "avatar_url": user.get("avatar_url", "")
        }
    }

@router.post("/admin/login", response_model=TokenResponse)
async def admin_login(req: UserLoginRequest):
    user = next((u for u in USERS_DB if u["email"].lower() == req.email.lower()), None)
    if not user or not verify_password(req.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrative credentials."
        )
    if user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Administrative role required."
        )

    token = create_access_token(subject=user["id"], role="admin")
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": "admin",
            "avatar_url": user.get("avatar_url", "")
        }
    }

@router.get("/me")
async def get_current_user(token: Optional[str] = None):
    # If no token provided, return Camille Laurent demo session or unauthenticated
    if not token:
        # Fallback to default active customer profile
        cust = db_store.customers[0]
        return {
            "id": cust["id"],
            "email": cust["email"],
            "full_name": cust["full_name"],
            "role": "customer",
            "loyalty_tier": cust.get("loyalty_tier", "Gold Member"),
            "loyalty_points": cust.get("loyalty_points", 1250),
            "allergies": cust.get("allergies", []),
            "skin_profile": cust.get("skin_profile", {})
        }

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session token.")
    
    user_id = payload.get("sub")
    user = next((u for u in USERS_DB if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    
    return {
        "id": user["id"],
        "email": user["email"],
        "full_name": user["full_name"],
        "role": user["role"],
        "avatar_url": user.get("avatar_url")
    }

@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    # Simulated password recovery email
    return {
        "success": True,
        "message": f"Password reset instructions have been dispatched to {req.email}."
    }
