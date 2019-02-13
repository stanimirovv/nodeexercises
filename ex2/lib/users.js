// Dependencies
const data = require('./data');
const crypto = require('crypto');
const tokens = require('./tokens');

//Constants
let dirName = 'users';

/*
 * Exported functions
 */

// Creates user object
// returns null if any argument is invalid 
function createUser(phoneNumber, firstName, lastName, email, password, address ) {
  let user = {
    'email' : email,
    'phoneNumber' : phoneNumber,
    'firstName' : firstName,
    'lastName' : lastName,
    'password' : password,
    'address' : address,

    delete() {
      if( !isValidPhone(this.phoneNumber) ) {
        return Promise.reject('Invalid phone');
      }
      data.delete(dirName, this.phoneNumber);
    },

    store() {
      return data.write(dirName, this.phoneNumber, {'phoneNumber': this.phoneNumber, 'firstName': this.firstName, 'lastName': this.lastName, 'email': this.email, 'password': this.password });
    },

    update(newEmail, newFirstName, newLastName, newPassword) {
      // set new values if they are valid
      // since these fields are optional wrong fields will be ignored
      // since, I feel, it adds needless complexity for this particular assignment
      if(isEmailValid(newEmail)) {
        email = newEmail;
      }

      if(isValidName(newFirstName)) {
        firstName = newFirstName; 
      }

      if(isValidName(newLastName)) {
        lastName = newLastName;
      }

      if(isValidPassword(password)) {
        password = newPassword;
      }

      return this.store();
    },

    login(password) {
      if (this.password != password) {
        return Promise.reject('Passwords mismatch');
      }
      return tokens.createToken(phoneNumber);
    },

    logout(tokenID) {
      return tokens.deleteToken(tokenID);
    },

    // TODO
    placeOrder(tokenID, phoneNumber) {
        //Get token
        //validate        
        //get cart
        //count
        //send email
        //send invoice
        tokens.fetchToken(tokenID)
        .then( token => {
          return tokens.isValid(token, phoneNumber) ? Promise.resolve('ok') : Promise.reject('Invalid token');
        })
        .then( ok => {
          return carts.fetchCart(phoneNumber);
        })
        .then( cart =>{
           // TODO computation 
        })
        .catch( err => {
          console.log('Error placing order: ', err);
        });

    }

  };

  if (!isValidPhone(user.phoneNumber) 
      || !isValidName(user.firstName)
      || !isValidName(user.lastName)
      || !isValidPassword(user.password)
      || !isValidEmail(user.email)
    ) {
      console.log(isValidPhone(user.phoneNumber),
      isValidName(user.firstName),
      isValidName(user.lastName),
      isValidPassword(user.password),
      isValidEmail(user.email));
      return null;
    }
  return user;
}

// returns user by reading it from the storage layer using the phone number
function fetchUser(phone) {
  if( !isValidPhone(phone) ) {
    return Promise.reject('Invalid phone' + phone);
  }

  // let users = data.read(dirName, phoneNumber);
  return data.read(dirName, phone)
  .then(  userData => {return Promise.resolve( createUser(userData.phoneNumber, userData.firstName, userData.lastName, userData.email, userData.password, userData.address))})
  .catch( (err) => Promise.reject(err));
}

/*
 * private functions
 */

function isValidPhone(phone) {
  return typeof phone === 'string' && phone.length == 10; 
}

function isValidPassword(password) {
  return password.length > 5;
}

function isValidName(name) {
  return name.charAt(0).toUpperCase() === name.charAt(0);
}

function isValidEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 return re.test(String(email).toLowerCase());
}

// TODO use this function
function hashPassword(password){
  if(typeof(str) == 'string' && str.length > 0){
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
}

/*
 * Module exports
 */
// Constructor for in memory objects
module.exports.createUser = createUser;
// Constructor for objects from the DB
module.exports.fetchUser = fetchUser;
