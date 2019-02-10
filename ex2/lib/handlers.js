/*
 * Dependencies
 */
const tokens = require("./tokens");
const users = require("./users");

// Define all the handlers
const handlers = {};
// Sample handler
handlers.hello = (data,callback) => {
  return {'statusCode' : 200, 'payload':{'greeting' :'Hello, user!'}};
};

// Not found handler
handlers.notFound = (data) => {
  return { 'statusCode' : 404, 'payload': { 'msg': "Handler doesn't exist."}};
};

handlers.user = (data) => {

  // POST -> screateUser.store().then().reject();
  // PUT -> fetchUser
  // Route request depending on method
  // Call method from users
  // return { 'statusCode' : 404, 'payload': { 'msg': "Handler doesn't exist."}};
};

handlers.items = (data) => {
  
  console.log("Headers: ", data.headers);
  let tokenID = data.headers.token;
  //TODO validate token from here ?
  let phoneNumber = data.headers.phone;
  return tokens.fetchToken(tokenID)
  .then ( token => { 
    let authError = token === null || !tokens.isValid(token, phoneNumber);
    if (authError) {
      return { 'statusCode' : 400, 'payload' : 'Authentication error'};
    }
    else {
  return { 'statusCode' : 200, 'payload' : "[{name: 'Special pizza', priceCents: 100},{name: 'Pizza 2', priceCents: 200},{name: 'Pizza 3', priceCents: 100},{name: 'Special pizza 2', priceCents: 100},]"};
    }
  })
  .catch( err => {
    console.log('Error: ', err);
    return { 'statusCode': 500, 'payload': 'Internal system error!'};   
  });
};

handlers.login = (data) => {
  let phoneNumber = data.headers.phone;
  let password = data.headers.password;

  return users.fetchUser(phoneNumber)
  .then ( user => {
      return user.login(password);
  })
  .then ( tokenID => {
    return { 'statusCode': 200, 'payload':  tokenID};   
  })
  .catch( err => {
    console.log('Error: ', err);
    return { 'statusCode': 500, 'payload': 'Internal system error!'};   
  });
};

handlers.logout = (data) => {
  let phoneNumber = data.headers.phone;
  let tokenID = data.headers.token;

  return tokens.fetchToken(tokenID)
  .then ( token => { 
    let authError = token === null || !tokens.isValid(token, phoneNumber);
    if (authError) {
      Promise.reject( { 'statusCode' : 400, 'payload' : 'Authentication error'});
    }
    return Promise.resolve(tokenID);
  })
  .then( token => {
    tokens.deleteToken(tokenID);
  })
  .then( ok => {
    return {'statusCode' : 200, 'payload':'Logout ok'};
  })
  .catch(err => {
    console.log('Error: ', err);
    return {'statusCode' : 500, 'payload':'System Error'};
  });
};

handlers.cart = (data) => {
};

handlers.placeOrder = (data) => {
// POST
// cart id
// token
// payment system token
};

// Define the request router
var router = {
  'hello' : handlers.hello,
  'user' : handlers.user,
  'items' : handlers.items,
  'login' : handlers.login,
  'logout' : handlers.logout,
  'cart' : handlers.cart,
  'placeOrder' : handlers.user
};

function choose(path) {
  return typeof(router[path]) !== 'undefined' ? router[path] : handlers.notFound;
}

/*
 * private functions
 */

/*
 * exports
 */
module.exports.choose = choose;
