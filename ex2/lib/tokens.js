/*
 * Private module, assumes email is already validated.
 */

// TODO worker to cleanup old tokens


/*
 * Dependencies
 */

const data = require('./data');
const crypto = require('crypto');

/*
 * Constants
 */
const tokenDir = 'tokens';
const tokenIDlength = 10;

/*
 * Public interface
 */

function token() {

  let token = {
    
    createToken(phoneNumber) {
      let tokenID = getTokenID();
      let createdAtEpoch = Math.floor(new Date() / 1000); // seconds
      let token = {tokenID, phoneNumber, createdAtEpoch};
      return data.write(tokenDir, tokenID, token)
      .then( (ok) => {return Promise.resolve(tokenID)});
    },

    fetchToken(tokenID) {
      return data.read(tokenDir, tokenID);
    },

    // In a 'real' scenario this should check for phoneNumber
    deleteToken(tokenID) {
      return data.delete(tokenDir, tokenID);
    },

    isValid(token, phoneNumber) {
      return token.phoneNumber === phoneNumber;
    }
  }
  return token;
}

/*
 * Private functions
 */

function getTokenID() {
  var id = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < tokenIDlength; i++)
    id += possible.charAt(Math.floor(Math.random() * possible.length));

  return id;
}

/*
 * exports
 */
// since there are no member variables, doesn't make sence to return a constructor, rather a singleton
module.exports = token();
