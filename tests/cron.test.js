require('../config/configureAndValidate');
const fetch = require('jest-fetch-mock');
jest.setMock('node-fetch', fetch);
const fetchOriginal = require('node-fetch');
const sinon = require('sinon');

const startPredefinedJobs = require('../lib/predefinedJobs');
const removeInactiveUsers = require('../jobs/removeInactiveUsers');

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
      fetchOriginal.mockResponse(
        JSON.stringify({
          data: {
            users: {
              users: [
                {
                  id: 1,
                  placeholder: false,
                  created: '2020-05-15T11:21:08.594Z',
                },
              ],
            },
          },
        })
      );
      // NOTE: Run cron-job on every minute for testing.
      const pattern = '* * * * *';
      const logSpy = jest.spyOn(global.console, 'info');

      startPredefinedJobs(pattern, removeInactiveUsers);

      expect(logSpy).toHaveBeenCalledTimes(0);

      clock.tick(60000);

      expect(fetchOriginal).toHaveBeenCalledTimes(1);
      expect(fetchOriginal).toHaveBeenCalledWith(
        'http://localhost:4000/graphql',
        {
          method: 'post',
          body:
            '{"query":"query { users { users { id placeholder created } } }","variables":null}',
          headers: {
            Authorization: `Bearer ${process.env.API_AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      expect(logSpy).toBeCalledWith('Running predefined Cron Job');

      fetchOriginal.mockResponse(
        JSON.stringify({
          data: {
            users: {
              users: [
                {
                  id: 1,
                  placeholder: true,
                  created: '2020-04-15T11:21:08.594Z',
                },
              ],
            },
          },
        })
      );

      clock.tick(60000);

      expect(fetchOriginal).toHaveBeenCalledTimes(2);
    });

    it('Should log some messages when removing inactive users is successful', () => {
      const logSpy = jest.spyOn(global.console, 'info');

      expect(logSpy).toHaveBeenCalledTimes(4);
      expect(logSpy).toHaveBeenCalledWith('No inactive users.');
      expect(logSpy).toHaveBeenCalledWith('Inactive users removed.');
      expect(fetchOriginal).toHaveBeenCalledTimes(3);
    });
  });
});
