# app.py

from fastapi import FastAPI, Depends

from routers.auth_router import auth_router
from routers.sec_router import sec_router
from routers.stock_router import stock_router

app = FastAPI()

# Include the routers with tags for Swagger organization
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(sec_router, tags=["SecEdgar"])
app.include_router(stock_router, tags=["Stocks"])


@app.get("/")
async def welcome():
    return {"message": "Welcome to the API!"}
