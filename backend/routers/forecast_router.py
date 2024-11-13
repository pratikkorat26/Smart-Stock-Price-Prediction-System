from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
from prophet import Prophet
from starlette import status

from backend.models.forecast import ForecastIO
from backend.services.auth_services import decode_access_token

# FastAPI Router Setup
forecast_router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")


# Dependency: Extract and verify the current user
def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Dependency that extracts and verifies the current user from the token.
    """
    user = decode_access_token(token)  # Replace with your own implementation
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


# Forecast Endpoint
@forecast_router.post("/future", response_model=List[ForecastIO])
async def generate_forecast(
    data: List[ForecastIO],  # List of shared input/output model
    user: dict = Depends(get_current_user),
):
    """
    Generate a 7-day forecast using Prophet for the given data.
    """
    try:
        # Convert input data to a DataFrame compatible with Prophet
        df = pd.DataFrame([
            {
                "ticker": item.ticker,
                "ds": item.date,  # Prophet requires `ds` for dates
                "y": item.open  # Prophet requires `y` as the target column
            }
            for item in data
        ])

        # Initialize and train the Prophet model
        model = Prophet()
        model.fit(df[["ds", "y"]])

        # Generate future dates and predictions
        future = model.make_future_dataframe(periods=7)
        forecast = model.predict(future)

        # Extract the last 7 predictions and format the output
        result = forecast[["ds", "yhat"]].tail(7)
        output = [
            ForecastIO(
                ticker=data[0].ticker,  # Assuming all data has the same ticker
                date=row["ds"].strftime("%Y-%m-%d"),
                open=row["yhat"],  # Predicted open value
                high=None,
                low=None,
                close=None,
                volume=None,
                dividends=None,
                stock_split=None,
            )
            for _, row in result.iterrows()
        ]

        return output

    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"ValueError: {str(ve)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )
