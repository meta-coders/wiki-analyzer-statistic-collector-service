import * as pollingService from '../src/polling-service';

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
    process.env = { ...INITIAL_ENV };
  });

  afterAll(() => {
    /**
     * restore initial env
     */
    process.env = INITIAL_ENV;
  });

  test('must throw if server is not running', (done) => {
    const address = '127.0.0.1:3000';

    process.env.RECENT_CHANGES_API_URL = `ws://${address}`;

    pollingService.connect({ fromDate: new Date() }).subscribe({
      next: jest.fn(),
      error: (err) => {
        expect(err).toHaveProperty(
          'message',
          `connect ECONNREFUSED ${address}`,
        );
        done();
      },
      complete: () => {
        fail('must not complete');
        done();
      },
    });
  });
});
