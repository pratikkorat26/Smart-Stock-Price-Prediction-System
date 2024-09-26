import requests
import pandas as pd
from bs4 import BeautifulSoup
from datetime import datetime, timedelta

# Headers for SEC EDGAR API requests
headers = {'User-Agent': "email@address.com"}

def fetch_form_4_filings(cik: str, afterdate) -> list:
    """
    Fetch Form 4 filings for a given CIK from the SEC's EDGAR system.

    Args:
        cik (str): The CIK number for the company.

    Returns:
        list: A list of URLs for Form 4 filings.
    """

    url = f"https://data.sec.gov/submissions/CIK{cik}.json"

    # Headers to comply with SEC's requirements for automated requests
    headers = {
        "User-Agent": "SJSU, korat.pratik2001@gmail.com",
        "Accept-Encoding": "gzip, deflate",
        "Host": "data.sec.gov",
        "Connection": "keep-alive"
    }

    try:
        # Request the JSON data from the URL
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an error for bad responses

        # Parse the JSON content
        data = response.json()

        # Convert after_date string to a datetime object for comparison
        after_date = datetime.strptime(afterdate, "%Y-%m-%d")

        # Extract form 4 filings and filter by date
        form_4_filings = []
        for i, filing in enumerate(data.get('filings', {}).get('recent', {}).get('form', [])):
            if filing == '4':
                # Get the filing date and convert it to a datetime object
                filing_date_str = data['filings']['recent']['filingDate'][i]
                filing_date = datetime.strptime(filing_date_str, "%Y-%m-%d")

                # If the filing date is after the specified date, collect the link
                if filing_date > after_date:
                    accession_number = data['filings']['recent']['accessionNumber'][i].replace("-", "")
                    file_link = f"https://www.sec.gov/Archives/edgar/data/{data['cik']}/{accession_number}/index.html"
                    form_4_filings.append({
                        'filing_date': filing_date_str,
                        'accession_number': data['filings']['recent']['accessionNumber'][i],
                        'link': file_link
                    })

        new_filings = []
        for file in form_4_filings:
            final_link = file["link"].replace("index.html", "") + file["accession_number"] + ".txt"
            new_filings.append(final_link)

        return new_filings

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return []
