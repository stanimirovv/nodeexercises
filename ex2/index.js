// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const handlers = require('./lib/handlers');
const config = require('./config');
const data = require('./lib/data');
const user = require('./lib/users').createUser;
const fetchUser = require('./lib/users').fetchUser;
const sendmail = require('./lib/sendmail');
const tokens = require('./lib/tokens');
const cart = require('./lib/carts');

let myCart = cart();
// myCart.createCart('testcart')
// .then( (cart) => { console.log("cart added: ", cart); } )
// .catch( (err) => { console.log("cart add failed: ", err);});;

myCart.getCart('testcart', 1)
.then( (cart) => { console.log("cart added: ", cart); } )
.catch( (err) => { console.log("cart add failed: ", err);});;

// fetchUser('0000000000')
// .then( (user) => { return user.logout('BwDLa1F1z8') })
// .then( (tokenID) => { console.log('TOKEN ID:', tokenID)})
// .catch( (err) => { console.log('Error user: ', err)});

// fetchUser('0000')
// .then( (asd) => { console.log('aaaa');})
// .catch( (err) => { 'Error user: ', err});

// fetchUser('0000')
// .then( (asd) => { console.log('OK') })
// .catch( (err) => { console.log('error user: ', err)});

// console.log(newToken);
// tokens.createToken('00000000')
// .then( (tokenID) => {console.log('TOKEN ID: ', tokenID); return tokens.fetchToken(tokenID) })
// .then( (token) => { console.log('Token obj: ', token); console.log('Is token valid: ', tokens.isValid(token, '00000001'))})
// .catch( (err) => { console.log('something went wrong! err: ', err)});

// .catch(err => {console.log('ERROR: ', err)});

// sendmail('zlatin.stanimirovv@gmail.com', 'Hello lala world!')
// .then( (ok) => { console.log(' EMAIL QUEUED', ok );})
// .catch( (err) => {console.log( ' EMAIL ERROR', err);});

// let zlati = user('0000000000', 'Zlatin1', 'Stanimirov', 'zlat@abv.in', '123aaa');
// console.log(zlati);
// zlati.store();

// fetchUser('0000000000')
// .then( (user) => console.log('USER: ', user))
// .catch(err => console.log('ERROR:', err));

// fetchUser('0000000000')
// .then( (zlati) => { console.log('Before update: ', zlati); zlati.update('aaaaa@abv.bg').then(console.log('updated'));})
// .catch(err => console.log('ERROR:', err));


// WRITE data
// let created = data.write('users', '001', { 'name':'Nike', 'age':91} );
// created.then( (msg) => { console.log("Msg: ", msg) });

// let users = data.read('users', 'users');
// users.then( (parsedUsers) => { console.log("parsed users: ", parsedUsers) } );

// DELETE DATA
// let deleteUsers = data.delete('users', 'users');
// deleteUsers.then( (status) => { console.log('Status: ', status);});
// deleteUsers.catch( (err) => { console.log('ERROR: ', error);});

 // Configure the server to respond to all requests with a string
const server = http.createServer(function(req,res){

  // Parse the url
  let parsedUrl = url.parse(req.url, true);

  // Get the path
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  let queryStringObject = parsedUrl.query;

  // Get the HTTP method
  let method = req.method.toLowerCase();

  //Get the headers as an object
  let headers = req.headers;

  // Get the payload,if any
  let decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', function(data) {
      buffer += decoder.write(data);
  });

  req.on('end', function() {
    buffer += decoder.end();

    // Construct the data object to send to the handler
    let data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : buffer
    };

    // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
    let chosenHandler = handlers.choose(trimmedPath);

    // Route the request to the handler specified in the router
    new Promise((resolve, reject) => {
      data = chosenHandler(data);
      resolve(data);
    }).then( (data) => {
      parseHandlerResponse(res, data);
    });
  });
});

// Start the server
server.listen(config.port,function(){
  console.log('The server is up and running on port '+config.port);
});

function parseHandlerResponse(res, data) {
  // Use the status code returned from the handler, or set the default status code to 200
  statusCode = typeof(data.statusCode) == 'number' ? data.statusCode : 200;

  // Use the payload returned from the handler, or set the default payload to an empty object
  payload = data.payload || {};

  // Convert the payload to a string
  let payloadString = JSON.stringify(payload);

  // Return the response
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(statusCode);
  res.end(payloadString);
  console.log("Returning this response: ",statusCode,payloadString);
}
