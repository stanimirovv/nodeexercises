/*
 * Dependencies
 */
const tokens = require("./tokens");
const users = require("./users");
const carts = require("./carts");

/*
 * Constants
 */

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
  // Create user
  if ( data.method === 'POST') {
    let userData = JSON.parse(data.payload);
    let newUser = users.createUser( userData.phone, userData.firstName, userData.lastName, userData.email, userData.password, userData.address);  
    return newUser.store()
    .then( ok => {
      return { 'statusCode' : 200, 'payload' : 'User created, you may now login'};
    })
    .catch ( err => {
      console.log('Error:', err);
      return { 'statusCode' : 400, 'payload' : 'User cretion error'};
    });
  } else if ( data.method === 'PUT' ) { // TODO update
  } else if (data.method === 'DELETE' ) {
    let userData = JSON.parse(data.payload);
    return users.fetchUser( userData.phone)
    .then( user => {
      return user.delete(); 
    })
    .then( ok => {
      return { 'statusCode' : 200, 'payload' : 'User deleted'};
    })
    .catch( err => {
      console.log('Error:', err);
      return { 'statusCode' : 500, 'payload' : 'Error deleting user'};
    });
  }
};

handlers.items = (data) => {
  let tokenID = data.headers.token;
  let phoneNumber = data.headers.phone;
  if ( tokenID === undefined || phoneNumber === undefined) {
      return { 'statusCode' : 400, 'payload' : 'Authentication error'};
  }

  return tokens.fetchToken(tokenID)
  .then ( token => { 
    let authError = (token === null || !tokens.isValid(token, phoneNumber));
    if (authError) {
      return { 'statusCode' : 400, 'payload' : 'Authentication error'};
    }
    else {
      return { 'statusCode' : 200, 'payload' : JSON.stringify(carts.items)};
    }
  })
  .catch( err => {
    console.log('Error: ', err);
    return { 'statusCode': 500, 'payload': 'Internal system error!'};   
  });
};

handlers.login = (data) => {
  if ( data.method != 'POST' ) {
    return { 'statusCode' : 400, 'payload' : 'Authentication error'};
  }

  let phoneNumber = data.headers.phone;
  let password = data.headers.password;
  if ( password === undefined || phoneNumber === undefined) {
      return { 'statusCode' : 400, 'payload' : 'Authentication error'};
  }

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
  if ( data.method != 'POST' ) {
    return { 'statusCode' : 400, 'payload' : 'Authentication error'};
  }

  let phoneNumber = data.headers.phone;
  let tokenID = data.headers.token;
  if ( tokenID === undefined || phoneNumber === undefined) {
      return { 'statusCode' : 400, 'payload' : 'Authentication error'};
  }

  return tokens.fetchToken(tokenID)
  .then ( token => { 
    let authError = (token === null || !tokens.isValid(token, phoneNumber));
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

handlers.addToCart = (data) => {
  let phoneNumber = data.headers.phone;
  let tokenID = data.headers.token;
  let payload = JSON.parse(data.payload);
  let itemID = payload.itemID;
  
  console.log ( tokenID , phoneNumber, data.method );
  if ( data.method != 'POST' ) {
    return { 'statusCode' : 400, 'payload' : 'Authentication error'};
  }

  if ( tokenID === undefined || phoneNumber === undefined || itemID === undefined) {
      return { 'statusCode' : 400, 'payload' : 'Authentication error'};
  }
  
  return carts().addItemToCart(phoneNumber, itemID)
  .then ( cart => { 
    let payload = { 'cart': cart};
    return {'statusCode' : 200, 'payload': JSON.stringify(payload)};
  })
  .catch( err => {
      console.log( 'error: ', err);
      return { 'statusCode' : 400, 'payload' : 'Authentication error'};
  });
};

handlers.clearCart = (data) => {
  if ( data.method != 'POST' ) {
    return { 'statusCode' : 400, 'payload' : 'Authentication error'};
  }

  let phoneNumber = data.headers.phone;
  let tokenID = data.headers.token;
  if ( tokenID === undefined || phoneNumber === undefined) {
      return { 'statusCode' : 400, 'payload' : 'Authentication error'};
  }

  return carts().clearCart(phoneNumber)
  .then ( cart => { 
    return {'statusCode' : 200, 'payload':'Item added'};
  })
  .catch( err => {
      return { 'statusCode' : 400, 'payload' : 'Authentication error'};
  });
};

handlers.placeOrder = (data) => {
  if ( data.method != 'POST' ) {
    return { 'statusCode' : 400, 'payload' : 'Authentication error'};
  }

  let phoneNumber = data.headers.phone;
  let tokenID = data.headers.token;
  if ( tokenID === undefined || phoneNumber === undefined) {
      return { 'statusCode' : 400, 'payload' : 'Authentication error'};
  }
  return users.fetchUser( phoneNumber)
  .then( user => {
    return user.placeOrder(tokenID);
  })
  .then( ok => {
    return { 'statusCode' : 200, 'payload' : 'Order Placed'};
  })
  .catch( err => {
    return { 'statusCode' : 400, 'payload' : 'Authentication error'};
  });
};

// Define the request router
var router = {
  'hello' : handlers.hello,
  'user' : handlers.user,
  'items' : handlers.items,
  'login' : handlers.login,
  'logout' : handlers.logout,
  'addToCart' : handlers.addToCart,
  'clearCart' : handlers.clearCart,
  'placeOrder' : handlers.placeOrder
};

function choose(path) {
  return typeof(router[path]) !== 'undefined' ? router[path] : handlers.notFound;
}

/*
 * exports
 */
module.exports.choose = choose;
