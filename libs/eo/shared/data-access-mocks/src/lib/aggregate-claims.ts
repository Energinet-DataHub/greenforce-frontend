import { http, HttpResponse } from 'msw';
import { aggregateClaimsResponse } from './data/aggregate-claims';

export function aggregateClaimsMocks(apiBase: string) {
  return [getAggregateClaims(apiBase)];
}

function getAggregateClaims(apiBase: string) {
  return http.get(`${apiBase}/aggregate-claims`.replace('/api', '/wallet-api'), () => {
    const state = localStorage.getItem('aggregate-claims');
    if (state === 'has-error') {
      return HttpResponse.error();
    } else if (state === 'no-data') {
      return HttpResponse.json({ result: [] }, { status: 200 });
    } else {
      return HttpResponse.json(aggregateClaimsResponse, { status: 200 });
    }
  });
}
