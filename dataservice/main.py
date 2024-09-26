from fastapi import FastAPI
from dataservice.api.form4 import router as form4_router
from dataservice.api.yahoo import router as yahoo_router

app = FastAPI()

# Include the Form 4 router
app.include_router(form4_router)
app.include_router(yahoo_router)

