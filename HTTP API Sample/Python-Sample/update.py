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
# updating an entry
#

params = {
    'api': '',
    'v': 3
}

data = {
    FIELD_ID_1: 'SOME NEW VALUE',
    FIELD_ID_2: 'SOME OTHER NEW VALUE'
}

requests.post(API_ENDPOINT_FORM_PAGE, params=params, json=data, headers={'Authorization': 'Basic '+API_KEY})

#
# updating a subtable row
#

params = {
    'api': '',
    'v': 3
}

data = {
    f'_subtable_{SUBTABLE_KEY}': {
        SUBTABLE_ROW_ID: {
            SUBTABLE_FIELD_ID_1: 'SOME NEW VALUE 1',
            SUBTABLE_FIELD_ID_2: 'SOME NEW VALUE 2'
        }
    }
}

requests.post(API_ENDPOINT_FORM_PAGE, params=params, json=data, headers={'Authorization': 'Basic '+API_KEY})