const {
  setLogger,
  ConsoleLogger,
  GrayLogLogger,
  logger,
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

  logger.logDebug('GrayLogLogger initialized', { server, port, env });
};

module.exports = initializeLogger;
