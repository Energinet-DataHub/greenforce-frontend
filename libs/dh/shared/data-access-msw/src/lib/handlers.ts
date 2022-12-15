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
import { MockedRequest, RequestHandler } from 'msw';

import { chargesMocks } from './mocks/charges';
import { meteringPointMocks } from './mocks/metering-point';
import { wholesaleMocks } from './mocks/wholesale';
import { marketParticipantMocks } from './mocks/marketParticipant';
import { messageArchiveMocks } from './mocks/messageArchive';
import { adminMocks } from './mocks/admin';
import { marketParticipantUserMocks } from './mocks/MarketParticipantUser';
import { tokenMocks } from './mocks/token';

export function handlers(apiBase: string) {
  return [
    ...chargesMocks(apiBase),
    ...meteringPointMocks(apiBase),
    ...wholesaleMocks(apiBase),
    ...marketParticipantMocks(apiBase),
    ...messageArchiveMocks(apiBase),
    ...adminMocks(apiBase),
    ...marketParticipantUserMocks(apiBase),
    ...tokenMocks(apiBase),
  ] as RequestHandler[];
}

export function onUnhandledRequest(req: MockedRequest) {
  if (
    req.url.pathname.endsWith('.js') ||
    req.url.pathname.endsWith('.css') ||
    req.url.pathname.endsWith('.json') ||
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
