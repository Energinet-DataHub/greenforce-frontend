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
import { GraphQLHandler, RequestHandler, HttpHandler } from 'msw';

export type mocks = ((apiBase: string) => (HttpHandler | GraphQLHandler)[])[];

export function handlers(apiBase: string, mocks: mocks): RequestHandler[] {
  return mocks.map((mock) => mock(apiBase)).flat();
}

export function onUnhandledRequest(req: Request) {
  const url = new URL(req.url);
  if (
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.json') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.startsWith('/assets') ||
    url.host === 'fonts.gstatic.com' ||
    url.host.endsWith('.b2clogin.com')
  )
    return;

  const msg = `[MSW] Warning: captured a request without a matching request handler:

  • ${req.method} ${url.href}

If you still wish to intercept this unhandled request, please create a request handler for it.
Read more: https://mswjs.io/docs/getting-started/mocks`;

  console.warn(msg);
}
