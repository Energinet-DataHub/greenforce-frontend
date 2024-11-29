import { mocks, onUnhandledRequest, handlers } from '@energinet-datahub/gf/util-msw';
import { setupServer } from 'msw/node';

export function setupMSWServer(apiBase: string, mocks: mocks) {
  const server = setupServer(...handlers(apiBase, mocks));

  beforeAll(() => {
    // Enable the mocking in tests.
    server.listen({ onUnhandledRequest });
  });

  afterEach(() => {
    // Reset any runtime handlers tests may use.
    server.resetHandlers();
  });

  afterAll(() => {
    // Clean up once the tests are done.
    server.close();
  });
}
