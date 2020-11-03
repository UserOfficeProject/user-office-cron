require('./config/configureAndValidate');
const ALLJOBS = require('./lib/allJobs');
const runAllJobs = require('./lib/runAllJobs');

const bootstrap = () => {
  // NOTE: Run all predefined jobs
  runAllJobs(ALLJOBS);
};

bootstrap();
