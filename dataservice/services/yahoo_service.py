import yfinance as yf

def fetch_stock_data(ticker: str):
    """
    Fetch historical stock data for the past year from Yahoo Finance.

    Args:
        ticker (str): The stock ticker symbol.

    Returns:
        tuple: A list of stock data records and an error message (if any).
    """
    stock = yf.Ticker(ticker)
    hist = stock.history(period="1y")

    if hist.empty:
        return None, "No data found for this ticker."

    # Convert DataFrame to list of dictionaries
    data = hist.reset_index().to_dict(orient='records')
    return data, None
