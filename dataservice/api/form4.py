from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dataservice.services.sec_service import fetch_form_4_filings
from dataservice.utils.mapping import ticker_cik_mapping
from dataservice.database.db import insert_links, db

# Create a FastAPI router instance
router = APIRouter()


# Define Pydantic models for the response
class Form4LinksResponse(BaseModel):
    form_4_links: list[str]


@router.get("/form4/{ticker}", response_model=Form4LinksResponse)
def get_form_4_links(ticker: str):
    """
    Retrieve Form 4 links for a given ticker symbol.

    Args:
        ticker (str): The stock ticker symbol.

    Returns:
        Form4LinksResponse: A JSON response containing the Form 4 links.
    """
    # Fetch CIK for the given ticker
    cik = ticker_cik_mapping.get(ticker)
    if not cik:
        raise HTTPException(status_code=404, detail="Ticker not found")

    # Check for existing Form 4 links in the database
    existing_links = list(db[f'form_4_links_{ticker}'].find({"ticker": ticker}))

    if existing_links:
        # Return existing links if found
        return Form4LinksResponse(form_4_links=[link['link'] for link in existing_links])

    # Fetch new Form 4 links from SEC if not found in the database
    form_4_links = fetch_form_4_filings(cik)

    if not form_4_links:
        return JSONResponse(content={"message": "No Form 4 filings found in the last year."}, status_code=404)

    # Insert newly fetched links into the database
    insert_links(ticker, form_4_links)

    return Form4LinksResponse(form_4_links=form_4_links)
