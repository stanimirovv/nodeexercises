/*
 * Billing module
 * the API hides the external system
 * Required configuration:
 *  - stripe path
 *  - stripe url 
 *  - stripe secret
 *
 *  retrurns a promise
 */

/*
 * Dependencies
 */

const https = require('https');
const config = require('../config');
const querystring = require('querystring');

/*
 * Public methods
 */

function bill(amount, currency, source, description) {
  return new Promise( (resolve, reject) => {
    const postData = querystring.stringify({
        'amount':amount,
        'currency':currency,
        'source':source,
        'description':description,
    });

    const options = {
      hostname: config.payment.hostname,
      path: config.payment.path,
      method: 'POST',
      protocol: 'https:',
      auth: config.payment.auth,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      console.log(`STATUS: ${res.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      if (res.statusCode != 200 ) {
        return reject('Error submitting payment');
      } 
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
      });
      res.on('end', () => {
        console.log('No more data in response.');
        return resolve('OK');
      });
    });

    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
      return reject(e.message);
    });

    // write data to request body
    req.write(postData);
    req.end();
  });
}

/*
 * Module exports
 */
module.exports.bill = bill;
