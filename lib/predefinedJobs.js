const CronJob = require('cron').CronJob;

const startPredefinedJobs = (cronPattern, runAllJobs) => {
  const job = new CronJob(cronPattern, runAllJobs, null, true);

  job.start();
};

module.exports = startPredefinedJobs;
