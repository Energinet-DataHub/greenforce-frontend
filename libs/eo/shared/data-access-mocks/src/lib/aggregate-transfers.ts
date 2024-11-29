import { http, HttpResponse } from 'msw';
import { aggregateTransfersResponse } from './data/aggregate-transfers';

export function aggregateTransfersMocks(apiBase: string) {
  return [getAggregateTransfers(apiBase)];
}

function getAggregateTransfers(apiBase: string) {
  return http.get(`${apiBase}/aggregate-transfers`.replace('/api', '/wallet-api'), () => {
    const state = localStorage.getItem('aggregate-transfers');
    if (state === 'has-error') {
      return HttpResponse.error();
    } else if (state === 'no-data') {
      return HttpResponse.json({ result: [] }, { status: 200 });
    } else {
      return HttpResponse.json(aggregateTransfersResponse, { status: 200 });
    }
  });
}
