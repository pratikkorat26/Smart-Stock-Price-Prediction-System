import requests
import pandas as pd
from bs4 import BeautifulSoup
from datetime import datetime, timedelta

# Set headers for SEC EDGAR API requests
headers = {'User-Agent': "email@address.com"}

def fetch_form_4_filings(cik):
    filing_metadata_url = f'https://data.sec.gov/submissions/CIK{cik}.json'
    filing_metadata = requests.get(filing_metadata_url, headers=headers).json()
    recent_filings = pd.DataFrame(filing_metadata['filings']['recent'])

    # Convert filingDate to datetime and filter for last 1 year
    recent_filings['filingDate'] = pd.to_datetime(recent_filings['filingDate'])
    one_year_ago = datetime.now() - timedelta(days=365)
    recent_filings = recent_filings[recent_filings['filingDate'] > one_year_ago]

    form_4_filings = recent_filings[recent_filings['form'] == '4']

    if form_4_filings.empty:
        return []  # Return an empty list if no Form 4 filings found

    form_4_links = []
    for accession_number in form_4_filings['accessionNumber']:
        formatted_accession_number = accession_number.replace("-", "")
        index_url = f"https://www.sec.gov/Archives/edgar/data/{cik}/{formatted_accession_number}/index.html"

        # Fetch the index page
        index_response = requests.get(index_url, headers=headers)
        soup = BeautifulSoup(index_response.text, 'html.parser')

        # Find the link to the .txt file
        for link in soup.find_all('a'):
            if link.text.endswith('.txt'):
                txt_url = f"https://www.sec.gov{link['href']}"
                form_4_links.append(txt_url)
                break

    return form_4_links
