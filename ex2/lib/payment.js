/*
 * 
 *
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

function bill(amount, ) {
  // TODO build post data args
  const postData = querystring.stringify({
    'msg': 'Hello World!'
  });

  const options = {
    hostname: config.payment.hostname,
    path: config.payment.path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  // write data to request body
  req.write(postData);
  req.end();
}

/*
 * Private methods 
 */

/*
 * Module exports
 */
