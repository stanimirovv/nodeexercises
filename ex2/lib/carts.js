/*
 * dependencies
 */
const data = require('./data');

// TODO check phone number, move check 
// TODO add is token valid

/*
 * constants
 */
const cartDir = 'carts';

/*
 * public interface
 */
function carts() {
  let cart = {
    createCart(phoneNumber) {
      let cart = [];
      return data.write(cartDir, phoneNumber, cart);
    },

    getCart(phoneNumber) {
      return data.read(cartDir, phoneNumber);
    },

    addItemToCart(phoneNumber, cartItemID) {
      return this.getCart(phoneNumber)
      .then( (cart) => { 
         // TODO
         cart.push('apples');
         return data.write(cartDir, phoneNumber, cart);
      });
    },

    // Esentially same as createCart, want it different in case something in the
    // future pops up
    clearCart(phoneNumber) {
      let cart = [];
      return data.write(cartDir, phoneNumber, tokenID);
    }
    

  }
  return cart;
}

/*
 * private interface
 */

/*
 * module exports
 */

module.exports = carts;
