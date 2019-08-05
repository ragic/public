/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * This sample take "Meeting Minutes" for example.                           *
 * You can install it from our template                                      *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/

const YOUR_SERVER_URL = "www.ragic.com"; // fill your server url
const YOUR_ACCOUNT = "YOUR_ACCOUNT"; // fill your account name
const YOUR_TAB = "ragicproject-management"; // fill your tab info
const YOUR_TAB_INDEX = '10001'; // fill your tab index info

// nodejs modules
const https = require('https');
const querystring = require('querystring');

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Authentication                                                            *
 * Reference: https://www.ragic.com/intl/en/doc-api/24/Authentication        *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/

/**
 * @constant {string}
 * @description Your API key goes here
 * get one here (login required): https://www.ragic.com/sims/reg/getAPIKey.jsp
 */
const YOUR_API_KEY = ''; // fill your API key

/**
 * @async
 * @function authentication
 * @description we use HTTP Basic authentication with Ragic API Key
 *              for authentication.
 *              If for some reason that you are not able to send the API key
 *              as HTTP header or basic authorization, you can send
 *              the API key as a parameter with the name APIKey.
 *              You will need to add this parameter
 *              for every single request you send.
 * @summary HTTP Basic authentication with Ragic API Key
 * @returns {Promise<object>} Promise object represents json data from server
 * @see {@link https://www.ragic.com/intl/en/doc-api/24}
 * @see {@Link https://www.ragic.com/intl/en/doc-api/17}
 */
async function authentication() {
    return new Promise((resolve, reject) => {
        let req = https.get({
            hostname: YOUR_SERVER_URL,
            method: 'GET',
            path: '/AUTH',
            headers: {
                "Authorization": "Basic " + YOUR_API_KEY
            }
        }, res => {
            const { statusCode } = res;
            if (statusCode == 200) {
                const rawCookies = res.headers['set-cookie'];
                let cookies = {};
                for (let i = 0; i < rawCookies.length; ++i) {
                    let cookie = rawCookies[i];
                    let result = /([^=]+)=([^;]+);/.exec(cookie);
                    cookies[result[1]] = result[2];
                }
                res.resume();
                resolve(cookies);
            }
            else {
                res.resume();
                reject('Authentication Failed. Status Code: ' + statusCode);
                return;
            }
            res.on('end', () => {
                res.resume();
                resolve();
            });
        }).on('error', e => {
            reject(e);
        });
        req.end();
    });
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Writing                                                                   *
 * Reference: https://www.ragic.com/intl/en/doc-api/19                       *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/

/**
 * @async
 * @function httpsRequest
 * @description HTTP request base function
 * @param {string} method
 * @param {object} cookies
 * @param {object} path
 * @param {object} [postData={}]
 * @returns {Promise<object>>} Promise object represents json data from server
 * @see {@Link https://www.ragic.com/intl/en/doc-api/17}
 */
async function httpsRequest(method, cookies, path, postData = {}) {
    // object to string
    postData = querystring.stringify(postData);
    return new Promise((resolve, reject) => {
        // cookie obj to cookie string
        let strCookie = '';
        let keys = Object.keys(cookies);
        for (let name in cookies) {
            strCookie += `${name}=${cookies[name]};`;
        }
        // send HTTP get
        let req = https.request({
            hostname: YOUR_SERVER_URL,
            method: method,
            path: encodeURI(path),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length,
                'Cookie': strCookie
            }
        }, res => {
            const { statusCode } = res;
            let rawData = '';
            res.on('data', chunk => {
                rawData += chunk;
            });
            res.on('end', () => {
                // json parse
                let data = {};
                try {
                    data = JSON.parse(rawData);
                }
                catch (e) {
                    reject('JSON parse Error. Status Code: ' + statusCode);
                    return;
                }
                switch (statusCode) {
                    // OK - Everything worked as expected.
                    case 200:
                        resolve(data);
                        break;
                    // Bad Request
                    case 400:
                        reject('Bad Request - \' +' +
                            'Often missing a required parameter. \n' +
                            data.msg);
                        break;
                    // Unauthorized
                    case 401:
                        reject('Unauthorized - ' +
                            'No valid API key provided. \n' +
                            data.msg);
                        break;
                    // Request Failed
                    case 402:
                        reject('Request Failed - ' +
                            'Parameters were valid but request failed. ' +
                            data.msg);
                        break;
                    // Not Found
                    case 404:
                        reject("Not Found - " +
                            "The requested item doesn't exist. " +
                            data.msg);
                        break;
                    // Server errors, 500 502 503 504
                    case 500: case 502: case 503: case 504:
                        reject('Server errors - ' +
                            'something went wrong on Server. \n' +
                            data.msg + '\n' + 'Status Code: ' + statusCode);
                        break;
                    default:
                        reject('Unknown Error. Status Code: ' + statusCode);
                }
            });
        }).on('error', e => {
            reject(e);
        });
        req.write(postData);
        req.end();
    });
}

/**
 * @async
 * @function write
 * @description basic HTTP post
 * @param {object} cookies
 * @param {string} path
 * @returns {Promise<object>} Promise object represents json data from server
 * @see {@link https://www.ragic.com/intl/en/doc-api/15}
 * @see {@Link https://www.ragic.com/intl/en/doc-api/17}
 */
var write = httpsRequest.bind(null, 'POST');

/**
 * @async
 * @function del
 * @description basic HTTP delete
 * @param ${object} cookies
 * @param ${string} path
 * @returns {Promise<object>} Promise object represents json data from server
 * @see {@link https://www.ragic.com/intl/en/doc-api/20}
 * @see {@Link https://www.ragic.com/intl/en/doc-api/17}
 */
var del = httpsRequest.bind(null, 'DELETE');

/**
 * @async
 * @function createNewEntry
 * @param {object} cookies
 * @returns {Promise<object>} Promise object represents json data from server
 */
function createNewEntry(cookies) {
    return write(cookies, `/${YOUR_ACCOUNT}/${YOUR_TAB}/${YOUR_TAB_INDEX}` +
        `?api&v=3`, {
        // FieldId=value
        "2000042": "Annual Meeting",
        "2000043": "2017/12/19",
        "2000047": "Ragic",
        "2000046": "amy@ragic.com"
    });
}

/**
 * @async
 * @function createNewEntryWithSubtable
 * @param {object} cookies
 * @returns {Promise<object>} Promise object represents json data from server
 */
function createNewEntryWithSubtable(cookies) {
    return write(cookies, `/${YOUR_ACCOUNT}/${YOUR_TAB}/${YOUR_TAB_INDEX}` +
        `?api&v=3`, {
        // FieldId=value
        "2000042": "Annual Meeting",
        "2000043": "2017/12/19",
        "2000047": "Ragic",
        "2000046": "amy@ragic.com",
        // subtable
        "2000050_-1": "",
        "2000051_-1": "Sales",
        "2000052_-1": "amy@ragic.com",
        "2000053_-1": "02-2362-1107",
        "2000054_-1": "16",

        "2000050_-2": "",
        "2000051_-2": "Sales",
        "2000052_-2": "angie@ragic.com",
        "2000053_-2": "02-2362-1107",
        "2000054_-2": "18"
    });
}

/**
 * @async
 * @function modifyEntry
 * @param {object} cookies
 * @returns {Promise<object>} Promise object represents json data from server
 */
function modifyEntry(cookies) {
    const entryIndex = 1; // entry want to modify
    return write(cookies, `/${YOUR_ACCOUNT}/${YOUR_TAB}/${YOUR_TAB_INDEX}` +
        `/${entryIndex}?api&v=3`, {
        // FieldId=value
        "2000042": "Modified Meeting"
    });
}

/**
 * @async
 * @function deleteEntry
 * @param {object} cookies
 * @returns {Promise<object>} Promise object represents json data from server
 */
function deleteEntry(cookies) {
    const entryIndex = 1; // entry want to delete
    return del(cookies, `/${YOUR_ACCOUNT}/${YOUR_TAB}/${YOUR_TAB_INDEX}` +
        `/${entryIndex}?api&v=3`);
}

/**
 * @async
 * @function createNewEntryAfterRecalculateFormulas
 * @description Specifying doFormula=true tells Ragic API
 *              to recalculate all formulas first
 *              when a record is created or updated.
 * @param {object} cookies
 * @returns {Promise<object>} Promise object represents json data from server
 */
function createNewEntryAfterRecalculateFormulas(cookies) {
    return write(cookies, `/${YOUR_ACCOUNT}/${YOUR_TAB}/${YOUR_TAB_INDEX}` +
        `?api&v=3&doFormula=true`, {
        // FieldId=value
        "2000042": "Annual Meeting",
        "2000043": "2017/12/19",
        "2000047": "Ragic",
        "2000046": "amy@ragic.com"
    });
}

/**
 * @aysnc
 * @function createNewEntryAfterLoadDefaultValues
 * @description Specifying doDefaultValue=true tells Ragic API
 *              to load all default values when a record is created or updated.
 * @param {object} cookies
 * @returns {Promise<object>} Promise object represents json data from server
 */
function createNewEntryAfterLoadDefaultValues(cookies) {
    return write(cookies, `/${YOUR_ACCOUNT}/${YOUR_TAB}/${YOUR_TAB_INDEX}` +
        `?api&v=3&doDefaultValue=true`, {
        // FieldId=value
        "2000042": "Annual Meeting",
        "2000043": "2017/12/19",
        "2000047": "Ragic",
        "2000046": "amy@ragic.com"
    });
}

/**
 * @async
 * @function createNewEntryAfterLoadLinkAndValues
 * @description Specifying doLinkLoad=true tells Ragic API
 *              to load all link and load loaded values
 *              when a record is created or updated.
 * @param {object} cookies
 * @returns {Promise<object>} Promise object represents json data from server
 */
function createNewEntryAfterLoadLinkAndValues(cookies) {
    return write(cookies, `/${YOUR_ACCOUNT}/${YOUR_TAB}/${YOUR_TAB_INDEX}` +
        `?api&v=3&doLinkLoad=true`, {
        // FieldId=value
        "2000042": "Annual Meeting",
        "2000043": "2017/12/19",
        "2000047": "Ragic",
        "2000046": "amy@ragic.com"
    });
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Main                                                                      *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/

(async () => {
    try {
        let cookies = await authentication();
        let result;

        result = await createNewEntry(cookies);
        console.log('[Create New Entry]');
        console.log(JSON.stringify(result, null, 2));

        result = await createNewEntryWithSubtable(cookies);
        console.log('[Create New Entry With Subtable]');
        console.log(JSON.stringify(result, null, 2));

        try {
            result = await modifyEntry(cookies);
            console.log('[Modify Entry]');
            console.log(JSON.stringify(result, null, 2));
        }
        catch (e) {
            console.error('Modify Entry Failed. Is the entry index exist?');
            console.error('Detail: ' + e);
        }

        result = await createNewEntryAfterRecalculateFormulas(cookies);
        console.log('[Create New Entry After Recalculate Formulas]');
        console.log(JSON.stringify(result, null, 2));

        result = await createNewEntryAfterLoadDefaultValues(cookies);
        console.log('[Create New Entry After Load Default Values]');
        console.log(JSON.stringify(result, null, 2));

        result = await createNewEntryAfterLoadLinkAndValues(cookies);
        console.log('[Create New Entry After Load Link And Values]');
        console.log(JSON.stringify(result, null, 2));

        try {
            result = await deleteEntry(cookies);
            console.log('[Delete Entry]');
            console.log(JSON.stringify(result, null, 2));
        }
        catch (e) {
            console.error('Delete Entry Failed. Is the entry index exist?');
            console.error('Detail: ' + e);
        }
    }
    catch (e) {
        console.error(e);
    }
})();
