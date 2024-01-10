import { mocks, handlers, onUnhandledRequest } from './handlers';
import { setupWorker } from 'msw/browser';

export function setupServiceWorker(apiBase: string, mocks: mocks) {
  try {
    const worker = setupWorker(...handlers(apiBase, mocks));
    worker.start({ onUnhandledRequest });
    // eslint-disable-next-line no-empty
  } catch (error) {
    console.error(error);
  }
}
