// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const handlers = require('./lib/handlers');
const config = require('./config');
const data = require('./lib/data');
const user = require('./lib/users').createUser;

let asd = user('asdasdasd',2,3,4);
asd.test();

let dzhe = user('Zlatin',2,3,4);
dzhe.test();
// WRITE data
// let created = data.write('users', 'users', { 'name':'Mike', 'age':91} );
// created.then( (msg) => { console.log("Msg: ", msg) });

let users = data.read('users', 'users');
users.then( (parsedUsers) => { console.log("parsed users: ", parsedUsers) } );

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
