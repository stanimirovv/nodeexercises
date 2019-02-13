/*
 * dependencies
 */
const data = require('./data');
const tokens = require('./tokens');

/*
 * constants
 */
const cartDir = 'carts';
const cartItems = { 'pizza1' : {name: 'Special pizza', priceCents: 100, id: 'pizza1'},
                    'pizza2' : {name: 'Pizza 2', priceCents: 200, id: 'pizza2'},
                    'pizza3' : {name: 'Pizza 3', priceCents: 100, id: 'pizza3'},
                    'special_pizza' : {name: 'Special pizza 2', priceCents: 100, id: 'special_pizza'}
                  };
const cartItemLabels = Object.values(cartItems);

/*
 * public interface
 */
function carts() {
  let cart = {
    createCart(phoneNumber) {
      let cart = [];
      return data.write(cartDir, phoneNumber, cart);
    },

    fetchCart(phoneNumber) {
      return data.read(cartDir, phoneNumber);
    },

    addItemToCart(phoneNumber, cartItemID) {
      return this.fetchCart(phoneNumber)
      .then( (cart) => { 
        if ( cartItems[cartItemID] === undefined ) {
          return Promise.reject('Unexisting item id');
        }        
        cart.push(cartItems[cartItemID]);
        return data.write(cartDir, phoneNumber, cart);
      })
      .then( ok => {
        return this.fetchCart(phoneNumber);
      });
    },

    clearCart(phoneNumber) {
      let cart = [];
      return data.write(cartDir, phoneNumber, cart);
    },

    countCartSum(phoneNumber, cartItem) {
      return this.fetchCart(phoneNumber)
      .then( (cart) => { 
         cart.push(cartItem);
         return data.write(cartDir, phoneNumber, cart);
      })
      .then( ok => {
        return this.fetchCart(phoneNumber);
      });
    },

  }
  return cart;
}

/*
 * module exports
 */
module.exports = carts;
module.exports.items = cartItemLabels;
