import requests

SERVER_URL = ''
ACCOUNT_NAME = ''
TAB = ''
SHEET_INDEX = ''
RECORD_ID = ''


SUBTABLE_KEY = ''

API_KEY = 'YOUR_API_KEY'

API_ENDPOINT_LISTING_PAGE = f'https://{SERVER_URL}/{ACCOUNT_NAME}/{TAB}/{SHEET_INDEX}'
API_ENDPOINT_FORM_PAGE = f'https://{SERVER_URL}/{ACCOUNT_NAME}/{TAB}/{SHEET_INDEX}/{RECORD_ID}'

#
# deleting an entry
#

params = {
    'api': '',
    'v': 3
}

requests.delete(API_ENDPOINT_FORM_PAGE, params=params, headers={'Authorization': 'Basic '+API_KEY})


#
# deleting a subtable row
#   

params = {
    'api': '',
    'v': 3
}

data = {
    f'_DELSUB_{SUBTABLE_KEY}': [1] # row id in array
}

requests.post(API_ENDPOINT_FORM_PAGE, params=params, json=data, headers={'Authorization': 'Basic '+API_KEY})