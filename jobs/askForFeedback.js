const api = require('../config/api');
const moment = require('moment');
const { logger } = require('@user-office-software/duo-logger');

const DATE_FORMAT = 'YYYY-MM-DD';

const getScheduledEvents = async () => {
  const from = moment().subtract(4, 'weeks').format(DATE_FORMAT);
  const to = moment().add(2, 'weeks').format(DATE_FORMAT);

  const getScheduledEvents = {
    query: `
    query {
        scheduledEvents(endsAfter:"${from}", endsBefore:"${to}") {
            id
            feedback {
                status
            }
            feedbackRequests {
                id
            }
        }
    }`,
    variables: null,
  };

  const { data } = await api.call(getScheduledEvents);

  if (!data || !data.scheduledEvents) {
    throw new Error('Something went wrong! Could not fetch scheduled events.');
  }

  return data.scheduledEvents;
};

const requestFeedback = async () => {
  logger.logInfo('Running chronjob', { msg: 'Sending out feedback requests' });

  try {
    const events = await getScheduledEvents();

    for (const event of events) {
      const requestFeedback = {
        query: `
        mutation 
        { 
          requestFeedback(scheduledEventId: ${event.id}) 
          { 
            request {
              id
            }
            rejection {
              reason
              context
              exception
            } 
          } 
        }`,
        variables: null,
      };

      await api.call(requestFeedback);
    }
  } catch (error) {
    logger.logError(error);
  }
};

const options = { timeToRun: '0 12 * * *' }; // Every day at 12:00

module.exports = { functionToRun: requestFeedback, options };
