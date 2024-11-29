import { http, delay, HttpResponse } from 'msw';
import {
  aggregateConsumptionCertificatesResponse,
  aggregateProductionCertificatesResponse,
} from './data/aggregate-certificates';

export function aggregateCertificatesMocks(apiBase: string) {
  return [getAggregateCertificates(apiBase)];
}

function getAggregateCertificates(apiBase: string) {
  return http.get(
    `${apiBase}/aggregate-certificates`.replace('/api', '/wallet-api'),
    async ({ request }) => {
      const state = localStorage.getItem('aggregate-certificates');
      const url = new URL(request.url);
      const type = url.searchParams.get('type');

      if (state === 'has-error') {
        return HttpResponse.error();
      } else if (state === 'no-data') {
        return HttpResponse.json({ result: [] }, { status: 200 });
      } else {
        await delay(1000);
        return HttpResponse.json(
          type === 'consumption'
            ? aggregateConsumptionCertificatesResponse
            : aggregateProductionCertificatesResponse,
          { status: 200 }
        );
      }
    }
  );
}
