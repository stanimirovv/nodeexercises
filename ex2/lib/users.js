// Dependencies
const data = require('./data');

// start with index key
function createUser(phoneNumber, firstName, lastName, email, password ) {
  let user = {};
  user.test = test;
  user.name = phoneNumber;
  return user;
}

function test () {
  console.log("AAAAAAAAAA", this.name);
}

function delete() {
}

function login(phone, password) {
}

function logout(phone, password) {
}

function update(firstName, lastName, email, password) {
}

function fetchUser(phone) {
// get user
// .then createUser()
}

function storeUser() {
}


// Constructor for in memory objects
module.exports.createUser = createUser;
// Constructor for objects from the DB
module.exports.fetchUser = fetchUser;
