import yfinance as yf

def fetch_stock_data(ticker: str):
    """
    Fetch stock data for a given ticker symbol from Yahoo Finance.

    Args:
        ticker (str): The stock ticker symbol.

    Returns:
        dict: A dictionary containing stock data or an error message.
    """
    stock = yf.Ticker(ticker)

    # Fetch historical market data for the last year
    hist = stock.history(period="1y")

    if hist.empty:
        return None, "No data found for this ticker."

    # Convert the DataFrame to a dictionary for easy response formatting
    data = hist.reset_index().to_dict(orient='records')
    print(data)
    return data, None
