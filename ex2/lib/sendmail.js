/*
 * send email via Mailgun API. 
 * the API hides the external system
 * Required configuration:
 *  - api key
 *  - mail gun api url
 *  - from:
 *  - mail gun secret
 *  Subject and text are hardcoded here. For a prod system they probablly shouldn't be. 
 *
 *  sendMail returns a promise
 */

/*
 * Dependencies
 */
const https = require('https');
const conf = require('../config');
const querystring = require('querystring');

/* 
 * Public methods
 */

function sendMail(sendTo, emailBody) {
  // Build request
  return new Promise( (resolve, reject) => {
    const postData = buildPostData(sendTo, emailBody);
    const stringPayload = querystring.stringify(postData);
    const options = buildOptions(stringPayload);

    console.log(options);
    console.log(stringPayload);

    // Send request and parse response
    const req = https.request(options, (res) => {
      console.log(`STATUS: ${res.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
      });
      res.on('end', () => {
        if (res.statusCode != 200 ) {
          return reject('Status not 200');
        }
        console.log('No more data in response.');
        return resolve('OK');
      });
    });

    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
      reject(e);
    });

    req.write(stringPayload);
    req.end();
  });
}

/* 
 * Private methods
 */

function buildPostData(sendTo, emailBody) {
  return {
    'from' : conf.email.from,
    'to' : sendTo,
    'subject' : "Order recieved",
    'text' : emailBody
  };
}

function buildOptions(postData) {
  return {
    protocol: 'https:',
    hostname: conf.email.hostname,
    path: conf.email.path,
    method: 'POST',
    auth: conf.email.secret,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
}

/* 
 * Exports
 */ 
module.exports = sendMail;
