const CronJob = require('cron').CronJob;
const { logger } = require('@user-office-software/duo-logger');

const runAllJobs = (allJobs) => {
  allJobs.forEach((job) => {
    const cronJob = new CronJob(
      job.options.timeToRun,
      job.functionToRun,
      null,
      true
    );

    try {
      cronJob.start();
    } catch (error) {
      logger.logException(error);
    }
  });
};

module.exports = runAllJobs;
