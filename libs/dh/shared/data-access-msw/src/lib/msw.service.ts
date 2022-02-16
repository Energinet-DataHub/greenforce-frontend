/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
