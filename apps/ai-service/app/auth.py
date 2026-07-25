from fastapi import Request, HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, List
import jwt
from app.config import settings

security = HTTPBearer(auto_error=False)

class UserSession:
    def __init__(self, user_id: str, email: str, role: str):
        self.user_id = user_id
        self.email = email
        self.role = role

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Security(security)) -> UserSession:
    """
    Validates Supabase JWT token or returns a default session for development if secret not set.
    """
    if not credentials:
        # Fallback for open dev testing
        return UserSession(user_id="dev-user-001", email="developer@forge.os", role="founder")
    
    token = credentials.credentials
    if not settings.SUPABASE_JWT_SECRET:
        # Decode without verification in local dev if secret not configured
        try:
            payload = jwt.decode(token, options={"verify_signature": False})
            return UserSession(
                user_id=payload.get("sub", "dev-user"),
                email=payload.get("email", "user@forge.os"),
                role=payload.get("user_metadata", {}).get("role", "founder")
            )
        except Exception:
            return UserSession(user_id="dev-user-001", email="developer@forge.os", role="founder")

    try:
        payload = jwt.decode(token, settings.SUPABASE_JWT_SECRET, algorithms=["HS256"])
        return UserSession(
            user_id=payload.get("sub"),
            email=payload.get("email"),
            role=payload.get("user_metadata", {}).get("role", "founder")
        )
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authorization token")

def require_roles(allowed_roles: List[str]):
    def role_checker(user: UserSession = Depends(get_current_user)):
        if user.role not in allowed_roles and "admin" not in user.role:
            raise HTTPException(
                status_code=403, 
                detail=f"Access forbidden for role '{user.role}'. Allowed: {allowed_roles}"
            )
        return user
    return role_checker
