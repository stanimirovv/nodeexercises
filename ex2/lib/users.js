// Dependencies
const data = require('./data');
const crypto = require('crypto');


//Constants
let dirName = 'users';

/*
 * Exported functions
 */

// Creates user object
// returns null if any argument is invalid 
function createUser(phoneNumber, firstName, lastName, email, password ) {
  let user = {
    'phoneNumber' : phoneNumber,
    'firstName' : firstName,
    'lastName' : lastName,
    'email' : email,
    'password' : password,

    delete() {
      if( !isValidPhone(this.phoneNumber) ) {
        return Promise.reject('Invalid phone');
      }
      data.delete(dirName, this.phoneNumber);
    },

    store() {
      return data.write(dirName, this.phoneNumber, {phoneNumber, firstName, lastName, email, password });
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

    // TODO
    login(phoneNumber, password) {
    },

    // TODO
    logout(phoneNumber, password) {
    },

  };

  if (!isValidNumber(user.phoneNumber) 
      || !isValidName(user.firstName)
      || !isValidName(user.lastName)
      || !isValidPassword(user.password)
      || !isValidEmail(user.email)
    ) {
      return null;
    }
  return user;
}

// returns user by reading it from the storage layer using the phone number
function fetchUser(phoneNumber) {
  if( !isValidPhone(phoneNumber) ) {
    return Promise.reject('Invalid phone' + phoneNumber);
  }

  // let users = data.read(dirName, phoneNumber);
  return data.read(dirName, phoneNumber)
  .then(  userData => {return Promise.resolve( createUser(userData.phoneNumber, userData.firstName, userData.lastName, userData.email, userData.password))})
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
  return name.charAt(0).toUpperCase() == name.slice(1);;
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
