import { mocks, handlers, onUnhandledRequest } from './handlers';
import { setupWorker } from 'msw/browser';

declare const window: {
  cypressMockServiceWorkerIntercept: Promise<unknown> | undefined;
  serviceWorkerRegistration: Promise<unknown> | undefined;
} & Window;

export async function setupServiceWorker(apiBase: string, mocks: mocks) {
  try {
    if (window.cypressMockServiceWorkerIntercept) {
      await window.cypressMockServiceWorkerIntercept;
    }

    const worker = setupWorker(...handlers(apiBase, mocks));
    window.serviceWorkerRegistration = worker.start({ onUnhandledRequest });
    await window.serviceWorkerRegistration;
  } catch (error) {
    console.error('setupServiceWorker', error);
  }
}
