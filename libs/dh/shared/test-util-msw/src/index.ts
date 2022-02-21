import { onUnhandledRequest } from '@energinet-datahub/dh/shared/util-msw';

import { server } from './lib/server';

beforeAll(() => {
  // Enable the mocking in tests.
  server.listen({onUnhandledRequest});
});

afterEach(() => {
  // Reset any runtime handlers tests may use.
  server.resetHandlers();
});

afterAll(() => {
  // Clean up once the tests are done.
  server.close();
});
