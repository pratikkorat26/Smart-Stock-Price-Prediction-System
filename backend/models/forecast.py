from typing import Optional

from pydantic import BaseModel


class ForecastIO(BaseModel):
    ticker: str
    date: str  # ISO date string
    open: Optional[float]
    high: Optional[float] = None
    low: Optional[float] = None
    close: Optional[float] = None
    volume: Optional[float] = None
    dividends: Optional[float] = None
    stock_split: Optional[float] = None

