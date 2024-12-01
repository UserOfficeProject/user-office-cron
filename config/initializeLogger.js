const {
  setLogger,
  ConsoleLogger,
  GrayLogLogger,
} = require('@user-office-software/duo-logger');

const initializeLogger = () => {
  const server = process.env.GRAYLOG_SERVER;
  const port = process.env.GRAYLOG_PORT;
  const env = process.env.NODE_ENV || 'unset';
  setLogger([
    new ConsoleLogger(), // Log to console
    new GrayLogLogger( // Log to Graylog
      server,
      parseInt(port),
      { facility: 'DMSC', environment: env, service: 'duo-cron-job' },
      []
    ),
  ]);
};

module.exports = initializeLogger;
