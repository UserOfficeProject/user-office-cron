require('./config/configureAndValidate');
const startPredefinedJobs = require('./lib/predefinedJobs');
const runAllJobs = require('./jobs/allJobs');

const bootstrap = () => {
  // NOTE: Run all predefined jobs on every 1st and 15th each month at 7:30AM
  // '30 7 1,15 * *'
  startPredefinedJobs('* * * * *', runAllJobs);
};

bootstrap();
