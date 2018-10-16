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
 * Reading                                                                   *
 * Reference: https://www.ragic.com/intl/en/doc-api/8                        *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/

/**
 * @async
 * @function read
 * @description basic HTTP get
 * @param ${object} cookies
 * @param ${string} path
 * @returns {Promise<object>} Promise object represents json data from server
 * @see {@link https://www.ragic.com/intl/en/doc-api/8}
 * @see {@Link https://www.ragic.com/intl/en/doc-api/17}
 */
async function read(cookies, path) {
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
            method: 'GET',
            path: encodeURI(path),
            headers: { 'Cookie': strCookie }
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
                            data.msg + '\n' +
                            'Status Code: ' + statusCode);
                        break;
                    default:
                        reject('Unknown Error. Status Code: ' + statusCode);
                }
            });
        }).on('error', e => {
            reject(e);
        });
        req.end();
    });
}

/**
 * @async
 * @function readEntries
 * @param {Object} cookies
 * @returns {Promise<object>} Promise object represents json data from server
 * @see {@link https://www.ragic.com/intl/en/doc-api/8}
 */
async function readEntries(cookies) {
    return read(cookies, `/${YOUR_ACCOUNT}/${YOUR_TAB}/${YOUR_TAB_INDEX}` +
        `?api&v=3`);
}

/**
 * @async
 * @function readEntriesWithoutSubtables
 * @param {Object} cookies
 * @returns {Promise<object>} Promise object represents json data from server
 * @see {@link https://www.ragic.com/intl/en/doc-api/8}
 */
async function readEntriesWithoutSubtables(cookies) {
    return read(cookies, `/${YOUR_ACCOUNT}/${YOUR_TAB}/${YOUR_TAB_INDEX}` +
        `?api&v=3&subtables=0`);
}

/**
 * @async
 * @function readEntriesWithComment
 * @param {Object} cookies
 * @returns {Promise<object>} Promise object represents json data from server
 * @see {@link https://www.ragic.com/intl/en/doc-api/8}
 */
async function readEntriesWithComment(cookies) {
    return read(cookies, `/${YOUR_ACCOUNT}/${YOUR_TAB}/${YOUR_TAB_INDEX}` +
        `?api&v=3&comment=true`);
}

/**
 * @async
 * @function readEntriesWithFilter
 * @param {object} cookies
 * @returns {Promise<object>} Promise object represents json data from server
 * @see {@link https://www.ragic.com/intl/en/doc-api/9}
 */
async function readEntriesWithFilter(cookies) {
    const cell = '2000042';
    const operator = 'eq';
    const value = 'Annual Meeting';
    return read(cookies, `/${YOUR_ACCOUNT}/${YOUR_TAB}/${YOUR_TAB_INDEX}` +
        `?api&v=3&where=${cell},${operator},${value}`);
}

/**
 * @async
 * @function readEntriesWithLimit
 * @param {object} cookies
 * @returns {Promise<object>} Promise object represents json data from server
 * @see {@link https://www.ragic.com/intl/en/doc-api/10}
 */
async function readEntriesWithLimit(cookies) {
    const offset = 0;
    const pageSize = 1;
    return read(cookies, `/${YOUR_ACCOUNT}/${YOUR_TAB}/${YOUR_TAB_INDEX}` +
        `?api&v=3&limit=${offset},${pageSize}`);
}

/**
 * @async
 * @function readEntriesWithOrdering
 * @param {object} cookies
 * @returns {Promise<object>} Promise object represents json data from server
 * @see {@link https://www.ragic.com/intl/en/doc-api/11}
 */
async function readEntriesWithOrdering(cookies) {
    const cell = '2000042';
    // ASC for ascending order, or DESC for descending order.
    const order = 'DESC';
    return read(cookies, `/${YOUR_ACCOUNT}/${YOUR_TAB}/${YOUR_TAB_INDEX}` +
        `?api&v=3&order=${cell},${order}`);
}

/**
 * @async
 * @function readEntriesWithNaming
 * @param {object} cookies
 * @returns {Promise<object>} Promise object represents json data from server
 * @see {@link https://www.ragic.com/intl/en/doc-api/13}
 */
async function readEntriesWithNaming(cookies) {
    // EID (Field Id) or FNAME (Field Name)
    const naming = 'EID';
    return read(cookies, `/${YOUR_ACCOUNT}/${YOUR_TAB}/${YOUR_TAB_INDEX}` +
        `?api&v=3&naming=${naming}`);
}

/**
 * @async
 * @function readEntriesWithListing
 * @description Specifying listing=true tells Ragic API
 *              to only include fields in the listing page.
 * @param {object} cookies
 * @returns {Promise<object>} Promise object represents json data from server
 * @see {@link https://www.ragic.com/intl/en/doc-api/25/Other-GET-parameters}
 */
async function readEntriesWithListing(cookies) {
    const listing = true;
    return read(cookies, `/${YOUR_ACCOUNT}/${YOUR_TAB}/${YOUR_TAB_INDEX}` +
        `?api&v=3&listing=${listing}`);
}

/**
 * @async
 * @function readEntriesWithInfo
 * @description Adding the info=true parameter will add
 *              "Create Date", "Create User" information to the response
 * @param {object} cookies
 * @returns {Promise<object>} Promise object represents json data from server
 * @see {@link https://www.ragic.com/intl/en/doc-api/25/Other-GET-parameters}
 */
async function readEntriesWithInfo(cookies) {
    const info = true;
    return read(cookies, `/${YOUR_ACCOUNT}/${YOUR_TAB}/${YOUR_TAB_INDEX}` +
        `?api&v=3&info=${info}`);
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Main                                                                      *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * **/

(async () => {
    try {
        let cookies = await authentication();
        let result;

        result = await readEntries(cookies);
        console.log('[Read Entries]');
        console.log(JSON.stringify(result, null, 2));

        result = await readEntriesWithoutSubtables(cookies);
        console.log('[Read Entries Without Subtables]');
        console.log(JSON.stringify(result, null, 2));

        result = await readEntriesWithComment(cookies);
        console.log('[Read Entries With Comment]');
        console.log(JSON.stringify(result, null, 2));

        result = await readEntriesWithFilter(cookies);
        console.log('[Read Entries With Filter]');
        console.log(JSON.stringify(result, null, 2));

        result = await readEntriesWithLimit(cookies);
        console.log('[Read Entries With Limit]');
        console.log(JSON.stringify(result, null, 2));

        result = await readEntriesWithOrdering(cookies);
        console.log('[Read Entries With Ordering]');
        console.log(JSON.stringify(result, null, 2));

        result = await readEntriesWithNaming(cookies);
        console.log('[Read Entries With Naming]');
        console.log(JSON.stringify(result, null, 2));

        result = await readEntriesWithListing(cookies);
        console.log('[Read Entries With Listing]');
        console.log(JSON.stringify(result, null, 2));

        result = await readEntriesWithInfo(cookies);
        console.log('[Read Entries With Info]');
        console.log(JSON.stringify(result, null, 2));
    }
    catch (e) {
        console.error(e);
    }
})();
