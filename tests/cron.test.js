require('../config/configureAndValidate');
jest.mock('node-fetch');
const fetch = require('node-fetch');
const Response = require('node-fetch').Response;
const sinon = require('sinon');

const startPredefinedJobs = require('../lib/predefinedJobs');
const removeInactiveUsersMock = require('../jobs/mocks/removeInactiveUsers');

describe('Test if predefined jobs are running correctly', () => {
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Run predefined jobs', () => {
    it('Should call `removeInactiveUsers` twice in two minutes', () => {
      fetch.mockReturnValue(Promise.resolve(new Response()));
      // NOTE: Run cron-job on every minute for testing.
      const pattern = '* * * * *';
      const logSpy = jest.spyOn(global.console, 'log');

      startPredefinedJobs(pattern, removeInactiveUsersMock);

      expect(logSpy).toHaveBeenCalledTimes(0);

      clock.tick(60000);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/graphql', {
        method: 'post',
        body:
          '{"query":"mutation { deleteInactiveUsers { error, users { id } } }","variables":null}',
        headers: {
          Authorization: `Bearer ${process.env.API_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      expect(logSpy).toBeCalledWith('Running predefined Cron Job');

      clock.tick(60000);

      expect(fetch).toHaveBeenCalledTimes(2);

      expect(logSpy).toHaveBeenCalledTimes(2);
    });
  });
});
