const api = require('../config/api');
const { DateTime } = require('luxon');
const { logger } = require('@user-office-software/duo-logger');

const getScheduledEvents = async () => {
  const from = DateTime.now().minus({ weeks: 4 }).toISODate();
  const to = DateTime.now().plus({ weeks: 2 }).toISODate();

  const getScheduledEvents = {
    query: `
      query {
        scheduledEventsCore(filter:{endsAfter:"${from}", endsBefore:"${to}"}) {
          id
          feedback {
            status
          }
          feedbackRequests {
            id
          }
        }
      }
    `,
    variables: null,
  };

  const response = await api.call(getScheduledEvents);
  if (!response.data) {
    logger.logError('Cant fetch events. No data returned from API', response);
    throw new Error('Cant fetch events. No data returned from API');
  }

  const events = response.data.scheduledEventsCore;
  if (!events) {
    logger.logError('Cant fetch events. No events returned from API', response);
    throw new Error('Cant fetch events. No events returned from API');
  }

  return events;
};

const requestFeedback = async () => {
  logger.logInfo('Running cronjob', { msg: 'Sending out feedback requests' });

  try {
    const events = await getScheduledEvents();

    for (const event of events) {
      const requestFeedback = {
        query: `
          mutation {
            requestFeedback(scheduledEventId: ${event.id}) {
              id
            }
          }
        `,
        variables: null,
      };

      await api.call(requestFeedback);
    }
    const numberOfEventsHandled = events.length;
    logger.logInfo('Running cronjob', {
      msg: `Finished sending out feedback ${numberOfEventsHandled} requests`,
    });
  } catch (error) {
    logger.logError(error);
  }
};

const options = { timeToRun: '0 12 * * *' }; // Every day at 12:00

module.exports = { functionToRun: requestFeedback, options };
