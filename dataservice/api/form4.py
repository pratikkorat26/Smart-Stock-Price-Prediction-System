import datetime
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dataservice.services.sec_service import fetch_form_4_filings
from dataservice.utils.mapping import ticker_cik_mapping
from dataservice.database.db import insert_links, db
from datetime import date, timedelta

# Create a FastAPI router instance
router = APIRouter()


class Form4LinksResponse(BaseModel):
    """Response model for returning Form 4 links."""
    form_4_links: list[str]


@router.get("/form4/{ticker}", response_model=Form4LinksResponse)
def get_form_4_links(ticker: str,
                     from_date: str = Query(None, description="Filter filings after this date (YYYY-MM-DD)")):
    """
    Retrieve Form 4 filing links for a given ticker symbol from a specific date.

    Args:
        ticker (str): Stock ticker symbol.
        from_date (str, optional): Date from which to filter filings (format: YYYY-MM-DD). Defaults to one year ago.

    Returns:
        Form4LinksResponse: A JSON response containing Form 4 links.
    """
    # Fetch CIK for the given ticker from the ticker-CIK mapping
    cik = ticker_cik_mapping.get(ticker.upper())
    if not cik:
        raise HTTPException(status_code=404, detail="Ticker not found")

    # Use provided from_date or default to one year ago
    if from_date:
        try:
            afterdate = datetime.datetime.strptime(from_date, "%Y-%m-%d").strftime("%Y-%m-%d")
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
    else:
        afterdate = (date.today() - timedelta(days=365)).strftime("%Y-%m-%d")

    # Check the database for existing Form 4 links from that date
    existing_links = list(db[f'form_4_links_{ticker}'].find({"ticker": ticker, "filing_date": {"$gte": afterdate}}))

    if existing_links:
        # Return existing links if present
        return Form4LinksResponse(form_4_links=[link['link'] for link in existing_links])

    # Fetch new Form 4 links from SEC if not found in the database
    form_4_links = fetch_form_4_filings(cik, afterdate=afterdate)

    if not form_4_links:
        return JSONResponse(content={"message": f"No Form 4 filings found after {afterdate}."}, status_code=404)

    # Insert newly fetched links into the database
    insert_links(ticker, form_4_links)

    return Form4LinksResponse(form_4_links=form_4_links)
