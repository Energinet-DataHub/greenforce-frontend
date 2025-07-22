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

export function authorizationMocks(apiBase: string) {
  return [
    getConsent(apiBase),
    getConsents(apiBase),
    postGrantConsent(apiBase),
    getReceivedConsents(apiBase),
  ];
}

function getConsent(apiBase: string) {
  return http.get(`${apiBase}/authorization/client/:id`, () => {
    const data = {
      idpClientId: '529a55d0-68c7-4129-ba3c-e06d4f1038c4',
      name: 'MOCKED_CLIENT',
      redirectUrl: 'https://demo.energytrackandtrace.dk',
    };
    return HttpResponse.json(data, { status: 200 });
  });
}

function getReceivedConsents(apiBase: string) {
  return http.get(`${apiBase}/authorization/consents/received`, () => {
    const data = {
      result: [
        {
          organizationId: 39293595,
          organizationName: 'Company Inc.',
          tin: 39293595,
        },
        {
          organizationId: 77777777,
          organizationName: 'Viggos Vindmøller',
          tin: 77777777,
        },
        {
          organizationId: 12345678,
          organizationName: 'Startup I/S',
          tin: 12345678,
        },
        {
          organizationId: 55555555,
          organizationName: 'Fabrikant',
          tin: 55555555,
        },
        {
          organizationId: 66666666,
          organizationName: 'Bolighaj',
          tin: 66666666,
        },
        {
          organizationId: 28980671,
          organizationName: 'Energinet',
          tin: 28980671,
        },
      ],
    };
    return HttpResponse.json(data, { status: 200 });
  });
}

function getConsents(apiBase: string) {
  return http.get(`${apiBase}/authorization/consents`, () => {
    const data = {
      result: [
        {
          clientName: 'Ranularg',
          consentDate: 1719386787,
        },
        {
          clientName: 'Energinet Master Client',
          consentDate: 1719387102,
        },
        {
          clientName: 'Test',
          consentDate: 1719388267,
        },
      ],
    };
    return HttpResponse.json(data, { status: 200 });
  });
}

function postGrantConsent(apiBase: string) {
  return http.post(`${apiBase}/authorization/consent/grant`, () => {
    return HttpResponse.json({ status: 200 });
  });
}
