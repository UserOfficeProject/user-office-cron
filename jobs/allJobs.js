const removeInactiveUsers = require('./removeInactiveUsers');

const ALLJOBS = [removeInactiveUsers];

const runAllJobs = () => {
  ALLJOBS.forEach((job) => job());
};

module.exports = runAllJobs;
