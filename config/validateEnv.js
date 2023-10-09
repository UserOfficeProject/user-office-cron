const { cleanEnv, str, url } = require('envalid');

function validateEnv() {
  cleanEnv(process.env, {
    API_URL: url(),
    API_AUTH_TOKEN: str(),
    GRAYLOG_SERVER: str(),
    GRAYLOG_PORT: str(),
  });
}

module.exports = validateEnv;
