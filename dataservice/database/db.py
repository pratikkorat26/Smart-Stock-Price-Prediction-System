from pymongo import MongoClient, errors, UpdateOne
from datetime import datetime, timedelta

# MongoDB connection setup
MONGODB_URI = (
    "mongodb+srv://koratpratik2001:3UTSYp6E2nlQixgW@cmpe272project.j7rxj.mongodb.net/"
    "?retryWrites=true&w=majority&appName=Cmpe272Project"
)

# Connect to MongoDB cluster
client = MongoClient(MONGODB_URI)
db = client['sec_data']  # Database name


# Ensure index for Form 4 links collection
def ensure_index_links(collection):
    """Ensure a unique index for Form 4 links."""
    try:
        collection.create_index([("ticker", 1), ("link", 1)], unique=True)
    except errors.OperationFailure as e:
        print(f"Index creation failed or already exists: {e}")

# Insert new Form 4 links into the database, avoiding duplicates
def insert_links(ticker: str, links: list):
    """Insert new Form 4 links into the database, avoiding duplicates."""
    collection_form4 = db[f'form_4_links_{ticker}']  # Collection for Form 4 links
    ensure_index_links(collection_form4)
    new_links = [{"ticker": ticker, "link": link} for link in links]

    if new_links:
        try:
            collection_form4.insert_many(new_links, ordered=False)
            print(f"Inserted {len(new_links)} links for {ticker}.")
        except errors.BulkWriteError as bwe:
            print(f"Bulk write error: {bwe.details}")

# Ensure index for stock data collection
def ensure_index_stock(collection):
    """Ensure a unique index for stock data."""
    try:
        collection.create_index([("Date", 1)], unique=True)
    except errors.OperationFailure as e:
        print(f"Index creation failed or already exists: {e}")

# Insert stock data while avoiding duplicates
def insert_stock_data(ticker: str, stock_data: list, max_entries: int = 500):
    """Insert new stock data into the database, keeping only the latest `max_entries`."""

    # Get or create a collection for the specific ticker
    collection_stock = db[f"stock_data_{ticker}"]

    ensure_index_stock(collection_stock)  # Ensure index on the specific collection

    # Calculate the date one year ago from today
    one_year_ago = datetime.now() - timedelta(days=365)

    # Remove old stock data older than one year for the given ticker
    collection_stock.delete_many({"Date": {"$lt": one_year_ago}})

    # Upsert stock data under the ticker
    operations = []
    for data in stock_data:
        operations.append(
            UpdateOne(
                {"Date": data['Date']},
                {"$set": data},  # Update with the new data
                upsert=True
            )
        )

    if operations:
        try:
            # Execute bulk write for faster operations
            collection_stock.bulk_write(operations, ordered=False)
            print(f"Bulk insert completed for {ticker}.")

            # Retain only the latest `max_entries` for stock data
            current_entries = list(collection_stock.find().sort("Date", -1).limit(max_entries))  # Sort by date descending

            if len(current_entries) == max_entries:
                # Get the date of the oldest entry we want to keep
                oldest_date_to_keep = current_entries[-1]["Date"]
                # Delete all entries older than this date
                collection_stock.delete_many({"Date": {"$lt": oldest_date_to_keep}})

        except errors.BulkWriteError as bwe:
            print(f"Bulk write error: {bwe.details}")