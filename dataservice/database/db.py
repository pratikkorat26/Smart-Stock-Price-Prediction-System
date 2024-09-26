from pymongo import MongoClient, errors, UpdateOne
from datetime import datetime, timedelta

# MongoDB connection setup
MONGODB_URI = (
    "mongodb+srv://koratpratik2001:3UTSYp6E2nlQixgW@cmpe272project.j7rxj.mongodb.net/?"
    "retryWrites=true&w=majority&appName=Cmpe272Project"
)

client = MongoClient(MONGODB_URI)
db = client['sec_data']  # Database name

def ensure_index_links(collection):
    """Ensure a unique index for Form 4 links."""
    try:
        collection.create_index([("ticker", 1), ("link", 1)], unique=True)
    except errors.OperationFailure as e:
        print(f"Index creation failed: {e}")

def insert_links(ticker: str, links: list):
    """Insert Form 4 links into the database, avoiding duplicates."""
    collection_form4 = db[f'form_4_links_{ticker}']
    ensure_index_links(collection_form4)
    new_links = [{"ticker": ticker, "link": link} for link in links]

    if new_links:
        try:
            collection_form4.insert_many(new_links, ordered=False)
            print(f"Inserted {len(new_links)} links for {ticker}.")
        except errors.BulkWriteError as bwe:
            print(f"Bulk write error: {bwe.details}")

def ensure_index_stock(collection):
    """Ensure a unique index for stock data entries."""
    try:
        collection.create_index([("Date", 1)], unique=True)
    except errors.OperationFailure as e:
        print(f"Index creation failed: {e}")

def insert_stock_data(ticker: str, stock_data: list, max_entries: int = 500):
    """
    Insert stock data into the database, keeping only the latest `max_entries`.

    Args:
        ticker (str): The stock ticker symbol.
        stock_data (list): The stock data to insert.
        max_entries (int): Maximum number of entries to keep.
    """
    collection_stock = db[f"stock_data_{ticker}"]
    ensure_index_stock(collection_stock)

    # Remove stock data older than 1 year
    one_year_ago = datetime.now() - timedelta(days=365)
    collection_stock.delete_many({"Date": {"$lt": one_year_ago}})

    # Upsert stock data to avoid duplication
    operations = [
        UpdateOne(
            {"Date": data['Date']},
            {"$set": data},
            upsert=True
        )
        for data in stock_data
    ]

    if operations:
        try:
            collection_stock.bulk_write(operations, ordered=False)
            print(f"Inserted stock data for {ticker}.")

            # Retain only the latest `max_entries`
            current_entries = list(collection_stock.find().sort("Date", -1).limit(max_entries))
            if len(current_entries) == max_entries:
                oldest_date_to_keep = current_entries[-1]["Date"]
                collection_stock.delete_many({"Date": {"$lt": oldest_date_to_keep}})
        except errors.BulkWriteError as bwe:
            print(f"Bulk write error: {bwe.details}")
