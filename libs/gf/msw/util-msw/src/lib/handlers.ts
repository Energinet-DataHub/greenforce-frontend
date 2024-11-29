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
