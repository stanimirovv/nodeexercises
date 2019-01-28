// Define all the handlers
const handlers = {};
// Sample handler
handlers.hello = function(data,callback){
  return {'statusCode' : 200, 'payload':{'greeting' :'Hello, user!'}};
};

// Not found handler
handlers.notFound = function(data){
  return { 'statusCode' : 404, 'payload': { 'msg': "Handler doesn't exist."}};
};

// Define the request router
var router = {
  'hello' : handlers.hello
};

function choose(path) {
  return typeof(router[path]) !== 'undefined' ? router[path] : handlers.notFound;
}

module.exports.choose = choose;
