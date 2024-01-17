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
import { http, HttpResponse } from 'msw';
import { certificatesResponse } from './data/certificates';

export function certificatesMocks(apiBase: string) {
  return [
    getCertificates(apiBase),
    getCertificatesContracts(apiBase),
    postCertificatesContracts(apiBase),
    patchCertificatesContracts(apiBase),
  ];
}

function getCertificates(apiBase: string) {
  return http.get(`${apiBase}/certificates`, () => {
    const data = certificatesResponse;
    return HttpResponse.json(data, { status: 200 });
  });
}

function getCertificatesContracts(apiBase: string) {
  return http.get(`${apiBase}/certificates/contracts`, () => {
    const data = {
      result: [
        {
          id: '7dd9e6ad-77f7-4ed1-b71f-6b6df6932e37',
          gsrn: '571313171355435420',
          startDate: 1698302563,
          endDate: 1698303524,
          created: 1698302563,
          meteringPointType: 'Consumption',
        },
        {
          id: 'd356b925-5942-4c74-9135-11925b448146',
          gsrn: '571313130083535430',
          startDate: 1697451288,
          endDate: 1697451290,
          created: 1697451288,
          meteringPointType: 'Production',
        },
        {
          id: 'a51a5b10-aa41-4601-b187-8b07e2cbf20b',
          gsrn: '571313130083535430',
          startDate: 1697451290,
          endDate: 1697451292,
          created: 1697451290,
          meteringPointType: 'Production',
        },
        {
          id: 'ed3aedf5-5c37-4cbd-8976-03d3b5131e42',
          gsrn: '571313130083535430',
          startDate: 1697451299,
          endDate: 1697721514,
          created: 1697451299,
          meteringPointType: 'Production',
        },
        {
          id: '4f8c14e1-a109-4f7c-9ce8-8655e91f9509',
          gsrn: '571313130083535430',
          startDate: 1697721515,
          endDate: 1697721647,
          created: 1697721515,
          meteringPointType: 'Production',
        },
        {
          id: '8a52ee9b-afa3-4f1e-93ad-4ebb7b6e9185',
          gsrn: '571313130083535430',
          startDate: 1697721651,
          endDate: null,
          created: 1697721651,
          meteringPointType: 'Production',
        },
        {
          id: 'f3bdc293-d64a-4430-905e-0fdff2ed3ef9',
          gsrn: '571313171355435420',
          startDate: 1698299479,
          endDate: 1698299488,
          created: 1698299479,
          meteringPointType: 'Consumption',
        },
        {
          id: 'd624bcd7-83e6-4d7d-9d04-9b7b22d11f9b',
          gsrn: '571313171355435420',
          startDate: 1698299493,
          endDate: 1698302553,
          created: 1698299494,
          meteringPointType: 'Consumption',
        },
        {
          id: 'a3b8e4dd-64eb-43ae-b56d-9123017d66aa',
          gsrn: '571313171355435420',
          startDate: 1698302556,
          endDate: 1698302559,
          created: 1698302556,
          meteringPointType: 'Consumption',
        },
        {
          id: '2e12b637-a87d-4415-b28e-af1acef734e6',
          gsrn: '571313171355435420',
          startDate: 1698303525,
          endDate: null,
          created: 1698303526,
          meteringPointType: 'Consumption',
        },
        {
          id: '2e12b637-a87d-4415-b28e-af1acef11111',
          gsrn: '571313171355411111',
          startDate: 1698303525,
          endDate: null,
          created: 1698303526,
          meteringPointType: 'Consumption',
        },
      ],
    };

    return HttpResponse.json(data, { status: 200 });
  });
}

function postCertificatesContracts(apiBase: string) {
  return http.post(`${apiBase}/certificates/contracts`, async ({ request }) => {
    const requestBody = (await request.json()) as { gsrn: string } | null;

    if (!requestBody) return new HttpResponse(null, { status: 400 });

    const data = {
      id: 'ef38c770-a8c0-48ea-8f25-d9a38e84b01c',
      gsrn: requestBody.gsrn,
      startDate: 1698311588,
      endDate: null,
      created: 1698311589,
      meteringPointType: null,
    };
    return HttpResponse.json(data, { status: 200 });
  });
}

function patchCertificatesContracts(apiBase: string) {
  return http.patch(`${apiBase}/certificates/contracts/:id`, () => {
    return ne wHttpResponse(null, { status: 200 });
  });
}
