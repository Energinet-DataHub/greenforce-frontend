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

export function reportsMocks(apiBase: string) {
  return [postReport(apiBase), getReports(apiBase)];
}

function postReport(apiBase: string) {
  return http.post(`${apiBase}/reports`, async ({ request }) => {
    const requestBody = (await request.json()) as { startDate: number; endDate: number } | null;

    if (!requestBody) return new HttpResponse(null, { status: 400 });

    return HttpResponse.json({ status: 202 });
  });
}

function getReports(apiBase: string) {
  return http.get(`${apiBase}/reports`, () => {
    const data = {
      result: [
        {
          id: '7dd9e6ad-77f7-4ed1-b71f-6b6df6932e37',
          createdAt: new Date().getTime(),
          status: 'Pending',
        },
        {
          id: 'd356b925-5942-4c74-9135-11925b448146',
          createdAt: (new Date().getTime() - 2629746000) / 1000,
          status: 'Ready',
        },
        {
          id: 'a51a5b10-aa41-4601-b187-8b07e2cbf20b',
          createdAt: (new Date().getTime() - 15556952000) / 1000,
          status: 'Failed',
        },
      ],
    };

    return HttpResponse.json(data, { status: 200 });
  });
}
