import { Inject, Injectable } from "@angular/core";
import { setupWorker, MockedRequest, RequestHandler, RestHandler, SetupWorkerApi } from "msw";
import { INITIAL_MOCKS } from "..";

@Injectable()
export class MSWService {
  private mocks: RequestHandler[] = [];
  private worker?: SetupWorkerApi;
  private isBrowser =
  typeof window !== 'undefined' && typeof window.document !== 'undefined';

  constructor(@Inject(INITIAL_MOCKS) initialMocks: RequestHandler[] = []){
    this.mocks = [...this.mocks, ...initialMocks];
    this.init();
  }

  init() {
    if (this.isBrowser) {
      this.worker = setupWorker(...this.mocks);
      this.worker.start({onUnhandledRequest: this.onUnhandledRequest});
    }
  }

  async addMocks(lazyMocks: () => Promise<RestHandler[]>) {
    const mocks = await lazyMocks();
    this.worker ? this.worker.use(...mocks) : [...this.mocks, ...mocks];
  }

  private onUnhandledRequest(req: MockedRequest) {
    if (
      req.url.pathname.startsWith('/assets') ||
      req.url.host === 'fonts.gstatic.com' ||
      req.url.host.endsWith('.b2clogin.com')
    )
      return;

    const msg = `[MSW] Warning: captured a request without a matching request handler:

    • ${req.method} ${req.url.href}

  If you still wish to intercept this unhandled request, please create a request handler for it.
  Read more: https://mswjs.io/docs/getting-started/mocks`;

    console.warn(msg);
  }
}
