import { http, HttpResponse } from 'msw';

export function defaultMocks(apiBase: string) {
  return [eventStream(apiBase)];
}

function eventStream(apiBase: string) {
  return http.post(`${apiBase}/graphql`, (x) => {
    if (x.request.headers.get('accept') !== 'text/event-stream') return;
    return new HttpResponse(new ReadableStream(), {
      headers: {
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream',
      },
    });
  });
}
