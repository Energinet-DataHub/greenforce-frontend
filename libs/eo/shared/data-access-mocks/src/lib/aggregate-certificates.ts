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
    `${apiBase}/v1/aggregate-certificates`.replace('/api', '/wallet-api'),
    async ({ request }) => {
      const state = localStorage.getItem('aggregate-certificates');
      const url = new URL(request.url);
      const type = url.searchParams.get('type');

      if (state === 'has-error') {
        return HttpResponse.error();
      } else if(state === 'no-data') {
        return HttpResponse.json({result: []}, { status: 200 });
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
