from pydantic import BaseModel, EmailStr, Field

from pydantic import BaseModel, EmailStr, Field


class User(BaseModel):
    first_name: str
    last_name: str
    email: str
    mobile: str
    hashed_password: str
