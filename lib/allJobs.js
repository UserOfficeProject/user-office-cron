const removeInactiveUsers = require('../jobs/removeInactiveUsers');
const askForFeedback = require('../jobs/askForFeedback');

const ALLJOBS = [removeInactiveUsers, askForFeedback];

module.exports = ALLJOBS;
