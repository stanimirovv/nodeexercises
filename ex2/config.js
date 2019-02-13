// Enviroments
let env = {};
env.staging = {
  port : 8000,
  email : {
    hostname: 'api.mailgun.net',
    path: '',
    from: '',
    secret: ''
  },
  payment : {
    hostname: 'api.stripe.com',
    path: '/v1/charges',
    auth: ''
  }
};

env.production = {
  port : 8000
};

// Pick and load env
function pickConfig() {
  let pickedEnv = process.env.mode;
  return env[pickedEnv] != undefined ? env[pickedEnvmode] : env.staging;
}

module.exports = pickConfig(); 
