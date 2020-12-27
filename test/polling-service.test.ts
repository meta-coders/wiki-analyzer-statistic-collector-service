import WS from 'jest-websocket-mock';

import * as pollingService from '../src/polling-service';

const STUB_RECENT_CHANGES_API_URL = 'ws://localhost:3000';

describe('Polling service', () => {
  const INITIAL_ENV = process.env;

  beforeEach(() => {
    /**
     * clear modules cache
     */
    jest.resetModules();

    /**
     * copy env to prevent overriding initial values
     */
    process.env = {
      ...INITIAL_ENV,
      RECENT_CHANGES_API_URL: STUB_RECENT_CHANGES_API_URL,
    };
  });

  afterAll(() => {
    /**
     * restore initial env
     */
    process.env = INITIAL_ENV;
  });

  test('must throw if server is not running', (done) => {
    pollingService.connect({ fromDate: new Date() }).subscribe({
      next: jest.fn(),
      error: (err) => {
        expect(err).toHaveProperty('type', 'error');
        done();
      },
      complete: () => {
        fail('must not complete');
        done();
      },
    });
  });

  test('must send fromDate to server when connected', async () => {
    const server = new WS(process.env.RECENT_CHANGES_API_URL);
    const fromDate = new Date();
    pollingService.connect({ fromDate }).subscribe();

    await server.connected;
    await expect(server).toReceiveMessage(fromDate.toISOString());
    server.close();
  });
});
