from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from dataservice.services.yahoo_service import fetch_stock_data
from dataservice.database.db import insert_stock_data

# Create a FastAPI router instance
router = APIRouter()

class StockDataResponse(BaseModel):
    """Pydantic model for the stock data response."""
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
    Retrieve stock data for the last year for a given ticker symbol from Yahoo Finance.

    Args:
        ticker (str): Stock ticker symbol.

    Returns:
        List[StockDataResponse]: A list of stock data entries.
    """
    stock_data, error = fetch_stock_data(ticker)

    if error:
        raise HTTPException(status_code=404, detail=error)

    if not stock_data:
        raise HTTPException(status_code=404, detail="No stock data found.")

    # Optionally insert stock data into the database
    insert_stock_data(ticker, stock_data)

    return [
        StockDataResponse(
            ticker=ticker,
            date=str(data['Date']),
            open=data['Open'],
            high=data['High'],
            low=data['Low'],
            close=data['Close'],
            volume=data['Volume'],
            dividends=data['Dividends'],
            stock_splits=data['Stock Splits']
        )
        for data in stock_data
    ]
