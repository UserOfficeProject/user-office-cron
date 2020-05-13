const { cleanEnv, port, str, host, url } = require('envalid');

function validateEnv() {
  cleanEnv(process.env, {
    HOST: host(),
    PORT: port(),
    API_URL: url(),
    API_AUTH_TOKEN: str(),
  });
}

module.exports = validateEnv;
