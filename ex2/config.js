// Enviroments
let env = {};
env.staging = {
  port : 8000
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
