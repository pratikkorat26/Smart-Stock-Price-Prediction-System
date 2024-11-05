# auth_router.py

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from database.database import user_db as db
from models.users import User
from services.auth_services import hash_password, verify_password, create_access_token, decode_access_token

auth_router = APIRouter()

# Define the token dependency
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


@auth_router.post("/signup")
async def signup(user: User):
    user_exists = db.users.find_one({"email": user.email})
    if user_exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")

    hashed_password = hash_password(user.hashed_password)
    new_user = User(
        first_name=user.first_name,  # Add first_name
        last_name=user.last_name,  # Add last_name
        email=user.email,
        mobile=user.mobile,  # Add mobile
        hashed_password=hashed_password
    )
    db.users.insert_one(new_user.dict())
    return {"message": "User created successfully"}


@auth_router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    print("in the login url")
    user = db.users.find_one({"email": form_data.username})
    print(user)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    if not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}


@auth_router.get("/me")
async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    # Find user by email and exclude hashed_password
    user = db.users.find_one({"email": payload.get("sub")}, {"hashed_password": 0})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    # Remove the _id field if it exists
    user.pop("_id", None)

    # Return user data
    return user
