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
  return { 'statusCode' : 200, 'payload' : "[{name: 'Coke', priceCents: 100},{name: 'Coke', priceCents: 100},{name: 'Coke', priceCents: 100},{name: 'Coke', priceCents: 100},]"};
};

handlers.tokens = (data) => {
//user, password
// Token life is 1h
// POST create token
// DELETE kill token
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
  'tokens' : handlers.tokens,
  'cart' : handlers.cart,
  'placeOrder' : handlers.user
};

function choose(path) {
  return typeof(router[path]) !== 'undefined' ? router[path] : handlers.notFound;
}

module.exports.choose = choose;
