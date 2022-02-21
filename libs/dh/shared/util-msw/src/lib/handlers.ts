import { MockedRequest, RequestHandler } from 'msw';

import { chargesMocks } from '@energinet-datahub/dh/charges/data-access-mocks';
import { meteringPointMocks } from '@energinet-datahub/dh/metering-point/data-access-mocks';

export const handlers: RequestHandler[] = [...chargesMocks, ...meteringPointMocks];

export function onUnhandledRequest(req: MockedRequest) {
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
