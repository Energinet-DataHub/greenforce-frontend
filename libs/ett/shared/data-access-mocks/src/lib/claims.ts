//#region License
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
//#endregion
import { http, HttpResponse } from 'msw';

export function claimsMocks(apiBase: string) {
  return [getClaims(apiBase), postStartClaimProcess(apiBase), delteStopClaimProcess(apiBase)];
}

const id = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

function postStartClaimProcess(apiBase: string) {
  return http.post(`${apiBase}/claim-automation/start`, () => {
    const data = {
      subjectId: id,
    };

    return HttpResponse.json(data, { status: 200 });
  });
}

function delteStopClaimProcess(apiBase: string) {
  return http.delete(`${apiBase}/claim-automation/stop`, () => {
    return new HttpResponse(null, { status: 204 });
  });
}

function getClaims(apiBase: string) {
  return http.get(`${apiBase}/claims`.replace('/api', '/wallet-api'), () => {
    const data = {
      result: [
        {
          claimId: id,
          quantity: 45000.45,
          productionCertificate: {
            federatedStreamId: {
              registry: 'string',
              streamId: id,
            },
            start: 0,
            end: 0,
            gridArea: 'string',
            attributes: {
              additionalProp1: 'string',
              additionalProp2: 'string',
              additionalProp3: 'string',
            },
          },
          consumptionCertificate: {
            federatedStreamId: {
              registry: 'string',
              streamId: id,
            },
            start: 0,
            end: 0,
            gridArea: 'string',
            attributes: {
              additionalProp1: 'string',
              additionalProp2: 'string',
              additionalProp3: 'string',
            },
          },
        },
      ],
    };

    return HttpResponse.json(data, { status: 200 });
  });
}
