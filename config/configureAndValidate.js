const { config } = require('dotenv');
const validateEnv = require('./validateEnv');

config({ path: process.env.NODE_ENV === 'production' ? '.env' : '.env.development' });
validateEnv();
