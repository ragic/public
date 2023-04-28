import requests

SERVER_URL = ''
ACCOUNT_NAME = ''
TAB = ''
SHEET_INDEX = ''
RECORD_ID = ''

FIELD_ID_1 = ''
FIELD_ID_2 = ''
SUBTABLE_KEY = ''
SUBTABLE_ROW_ID = ''
SUBTABLE_FIELD_ID_1 = ''
SUBTABLE_FIELD_ID_2 = ''

API_KEY = 'YOUR_API_KEY'

API_ENDPOINT_LISTING_PAGE = f'https://{SERVER_URL}/{ACCOUNT_NAME}/{TAB}/{SHEET_INDEX}'
API_ENDPOINT_FORM_PAGE = f'https://{SERVER_URL}/{ACCOUNT_NAME}/{TAB}/{SHEET_INDEX}/{RECORD_ID}'

#
# creating a new entry
#
params = {
    'api': '',
    'v': 3
}

data = {
    FIELD_ID_1: 'SOME VALUE',
    FIELD_ID_2: 'SOME OTHER VALUE'
}

requests.post(API_ENDPOINT_LISTING_PAGE, params=params, json=data, headers={'Authorization': 'Basic '+API_KEY})


#
# creating a new subtable row
#

params = {
    'api': '',
    'v': 3
}

data = {
    f'_subtable_{SUBTABLE_KEY}': {
        '-1': { # negative value to indicate a new row
            SUBTABLE_FIELD_ID_1: 'SOME NEW VALUE 123',
            SUBTABLE_FIELD_ID_2: 'SOME NEW VALUE 2333'
        }
    }
}

requests.post(API_ENDPOINT_FORM_PAGE, params=params, json=data, headers={'Authorization': 'Basic '+API_KEY})