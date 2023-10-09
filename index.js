require('./config/configureAndValidate');
const { logger } = require('@user-office-software/duo-logger');
const initializeLogger = require('./config/initializeLogger');
const ALLJOBS = require('./lib/allJobs');
const runAllJobs = require('./lib/runAllJobs');

const bootstrap = () => {
  // NOTE: Run all predefined jobs
  runAllJobs(ALLJOBS);
  logger.logInfo('Cronjob', { msg: 'All jobs are running' });
};

initializeLogger();
bootstrap();
