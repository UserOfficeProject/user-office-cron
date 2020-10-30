const CronJob = require('cron').CronJob;

const runAllJobs = (allJobs) => {
  allJobs.forEach((job) => {
    const cronJob = new CronJob(
      job.options.timeToRun,
      job.functionToRun,
      null,
      true
    );

    cronJob.start();
  });
};

module.exports = runAllJobs;
