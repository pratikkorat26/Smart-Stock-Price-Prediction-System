import yfinance as yf
from pymongo import UpdateOne, errors
from dateutil import parser
from datetime import datetime, timedelta
from pymongo import MongoClient
import logging

# MongoDB setup
client = MongoClient("mongodb+srv://koratpratik2001:3UTSYp6E2nlQixgW@cmpe272project.j7rxj.mongodb.net/?retryWrites=true&w=majority&appName=Cmpe272Project")  # Replace with your MongoDB URI if different
db = client["stock_data"]

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("stock_data.log"),
        logging.StreamHandler()
    ]
)

# Function to fetch stock data from Yahoo Finance
def fetch_stock_data(ticker: str):
    logging.info(f"Fetching stock data for ticker: {ticker}")
    stock = yf.Ticker(ticker)
    hist = stock.history(period="1y")

    if hist.empty:
        logging.warning(f"No data found for ticker: {ticker}")
        return None, "No data found for this ticker."

    data = hist.reset_index().to_dict(orient='records')
    logging.info(f"Fetched {len(data)} records for ticker: {ticker}")
    return data, None

# Ensure index for efficient updates
def ensure_index_stock(collection):
    """Ensures that the collection has an index on 'Date' to optimize upsert performance."""
    try:
        collection.create_index([("Date", 1)], unique=True)
        logging.info("Ensured index on Date field.")
    except errors.OperationFailure as e:
        logging.error(f"Error ensuring index on Date field: {e}")

# Insert stock data with duplicate avoidance and max_entries control
def insert_stock_data(ticker: str, stock_data: list, max_entries: int = 500):
    """Insert new stock data into the database, keeping only the latest `max_entries`."""
    collection_stock = db[f"stock_data_{ticker}"]

    # Ensure index on 'Date' for efficient upserts
    ensure_index_stock(collection_stock)

    # Date one year ago for filtering old data
    one_year_ago = datetime.now() - timedelta(days=365)
    collection_stock.delete_many({"Date": {"$lt": one_year_ago}})

    # Prepare bulk operations to upsert data
    operations = []
    for data in stock_data:
        # Parse Date to datetime object
        data['Date'] = parser.parse(str(data['Date']))
        data['ticker'] = ticker

        # Prepare upsert operation
        operations.append(
            UpdateOne(
                {"Date": data['Date']},
                {"$set": data},
                upsert=True
            )
        )

    # Execute bulk write
    if operations:
        try:
            collection_stock.bulk_write(operations, ordered=False)
            logging.info(f"Bulk insert completed for {ticker}.")

            # Retain only the latest `max_entries`
            current_entries = list(collection_stock.find().sort("Date", -1).limit(max_entries))

            if len(current_entries) == max_entries:
                oldest_date_to_keep = current_entries[-1]["Date"]
                collection_stock.delete_many({"Date": {"$lt": oldest_date_to_keep}})
                logging.info(f"Trimmed old entries, keeping latest {max_entries} records.")
        except errors.BulkWriteError as bwe:
            logging.error(f"Bulk write error: {bwe.details}")

def save_stock_data(ticker: str, delete_previous: bool = False, max_entries: int = 500):
    """
    Fetches and saves stock data for a given ticker. Deletes previous data if specified.

    Args:
        ticker (str): The stock ticker symbol.
        delete_previous (bool): Whether to delete previous data for the ticker.
        max_entries (int): Maximum number of entries to retain in the database.
    """
    stock_data, error = fetch_stock_data(ticker)

    if error:
        logging.error(f"Error: {error}")
        return

    if not stock_data:
        logging.warning("No stock data found.")
        return

    # Insert data with max_entries limit
    insert_stock_data(ticker, stock_data, max_entries=max_entries)
    logging.info(f"Data for {ticker} saved to the database.")

# Usage
if __name__ == "__main__":
    # Define your list of tickers
    ticker_symbols = ["AAPL", "NVDA", "META"]  # Add other tickers as needed

    # Loop through each ticker in the list and save data
    for ticker_symbol in ticker_symbols:
        save_stock_data(ticker_symbol, delete_previous=True, max_entries=500)