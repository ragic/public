import requests

SERVER_URL = ''
ACCOUNT_NAME = ''
TAB = ''
SHEET_INDEX = ''
RECORD_ID = ''

API_KEY = 'YOUR_API_KEY'

API_ENDPOINT_LISTING_PAGE = f'https://{SERVER_URL}/{ACCOUNT_NAME}/{TAB}/{SHEET_INDEX}'
API_ENDPOINT_FORM_PAGE = f'https://{SERVER_URL}/{ACCOUNT_NAME}/{TAB}/{SHEET_INDEX}/{RECORD_ID}'

#
# reading a list of entries (listing page)
#
params = {
    'api': '',
    'v': 3
}
requests.get(API_ENDPOINT_LISTING_PAGE, params=params, headers={'Authorization': 'Basic '+API_KEY})

#
# reading an entry
#
params = {
    'api': '',
    'v': 3
}
requests.get(API_ENDPOINT_FORM_PAGE, params=params, headers={'Authorization': 'Basic '+API_KEY})

