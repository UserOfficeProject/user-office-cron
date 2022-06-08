require('../config/configureAndValidate');
const fetch = require('jest-fetch-mock');
const { DateTime } = require('luxon');
jest.setMock('node-fetch', fetch);
const fetchOriginal = require('node-fetch');
const sinon = require('sinon');

const removeInactiveUsers = require('../jobs/removeInactiveUsers');
const runAllJobs = require('../lib/runAllJobs');

describe('Test if predefined jobs are running correctly', () => {
  let clock;
  const now = DateTime.now().startOf('minute');

  beforeEach(() => {
    clock = sinon.useFakeTimers(now.toJSDate());
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
      const logSpy = jest.spyOn(global.console, 'log');
      const allJobs = [
        {
          functionToRun: removeInactiveUsers.functionToRun,
          options: { timeToRun: pattern },
        },
      ];

      runAllJobs(allJobs);

      expect(logSpy).toHaveBeenCalledTimes(0);

      clock.tick(60000);

      expect(fetchOriginal).toHaveBeenCalledTimes(1);
      expect(fetchOriginal).toHaveBeenCalledWith(
        'http://localhost:4000/graphql',
        {
          method: 'post',
          body: '{"query":"query { users { users { id placeholder created } } }","variables":null}',
          headers: {
            Authorization: `Bearer ${process.env.API_AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      expect(logSpy).toBeCalledWith(
        `[${now
          .plus({
            minute: 1,
          })
          .toJSDate()
          .toISOString()}] INFO - Running cron-job \n {"msg":"Sending out remove inactive users requests"}`
      );

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
      const logSpy = jest.spyOn(global.console, 'log');

      expect(logSpy).toHaveBeenCalledTimes(4);
      expect(logSpy).toHaveBeenCalledWith(
        `[${now
          .plus({
            minute: 1,
          })
          .toJSDate()
          .toISOString()}] INFO - Running cron-job \n {"msg":"Sending out remove inactive users requests"}`
      );
      expect(logSpy).toHaveBeenCalledWith(
        `[${now
          .plus({
            minute: 2,
          })
          .toJSDate()
          .toISOString()}] INFO - Running cron-job \n {"msg":"Inactive users removed"}`
      );
      expect(fetchOriginal).toHaveBeenCalledTimes(3);
    });
  });
});
