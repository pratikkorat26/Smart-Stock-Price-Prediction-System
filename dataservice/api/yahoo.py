from typing import List

import pandas
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dataservice.services.yahoo_service import fetch_stock_data
from dataservice.database.db import insert_stock_data

# Create a FastAPI router instance
router = APIRouter()


# Define Pydantic model for the stock data response
class StockDataResponse(BaseModel):
    ticker: str
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: float
    dividends: float
    stock_splits: float


@router.get("/stock/{ticker}", response_model=List[StockDataResponse])
def get_stock_data(ticker: str):
    """
    API endpoint to get stock data for a given ticker symbol from Yahoo Finance.

    Args:
        ticker (str): The stock ticker symbol.

    Returns:
        List[StockDataResponse]: A JSON response containing the stock data.
    """
    stock_data, error = fetch_stock_data(ticker)

    if error:
        raise HTTPException(status_code=404, detail=error)

    if not stock_data:
        raise HTTPException(status_code=404, detail="No stock data found.")

    # Optionally insert stock data into the database
    insert_stock_data(ticker, stock_data)

    collection_data = [
        StockDataResponse(
            ticker=ticker,
            date=str(data['Date']),  # Ensure this key matches the structure
            open=data['Open'],  # Ensure this key matches the structure
            high=data['High'],  # Ensure this key matches the structure
            low=data['Low'],  # Ensure this key matches the structure
            close=data['Close'],  # Ensure this key matches the structure
            volume=data['Volume'],  # Ensure this key matches the structure
            dividends=data['Dividends'],  # Ensure this key matches the structure
            stock_splits=data['Stock Splits']  # Ensure this key matches the structure
        )
        for data in stock_data  # List comprehension to build the collection_data
    ]

    return collection_data
