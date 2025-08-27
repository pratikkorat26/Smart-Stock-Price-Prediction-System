from passlib.context import CryptContext
from jose import JWTError, jwt
from google.oauth2 import id_token
from google.auth.transport.requests import Request
import os

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("JWT_SECRET") or os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError(
        "JWT_SECRET (or SECRET_KEY) environment variable is not set. Set a strong secret for token signing."
    )
ALGORITHM = "HS256"


def decode_access_google_token(token: str):
    try:
        CLIENT_ID = os.getenv("GOOGLE_OAUTH_CLIENT_ID")
        if not CLIENT_ID:
            return None
        idinfo = id_token.verify_oauth2_token(token, Request(), CLIENT_ID)
        return idinfo
    except ValueError:
        return None

def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
