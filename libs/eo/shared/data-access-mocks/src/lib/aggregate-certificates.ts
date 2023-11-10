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
import { rest } from 'msw';

export function aggregateCertificatesMocks(apiBase: string) {
  return [getAggregateCertificates(apiBase)];
}

function getAggregateCertificates(apiBase: string) {
  return rest.get(`${apiBase}/v1/aggregate-certificates`.replace('/api', '/wallet-api'), (req, res, ctx) => {
    const searchParams = new URLSearchParams(req.url.searchParams);
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');

    const data = {
      result: [
        {start: startParam, end: startParam, quantity: 10000},
        {start: startParam, end: startParam, quantity: 20000},
        {start: startParam, end: startParam, quantity: 30000},
        {start: startParam, end: startParam, quantity: 40000},
        {start: startParam, end: startParam, quantity: 50000},
        {start: startParam, end: startParam, quantity: 60000},
        {start: startParam, end: startParam, quantity: 70000},
        {start: startParam, end: startParam, quantity: 80000},
        {start: startParam, end: startParam, quantity: 90000},
        {start: startParam, end: startParam, quantity: 10000},
        {start: startParam, end: startParam, quantity: 20000},
        {start: startParam, end: startParam, quantity: 30000},
        {start: startParam, end: startParam, quantity: 40000},
        {start: startParam, end: startParam, quantity: 50000},
        {start: startParam, end: startParam, quantity: 60000},
        {start: startParam, end: startParam, quantity: 70000},
        {start: startParam, end: startParam, quantity: 80000},
        {start: startParam, end: startParam, quantity: 90000},
        {start: startParam, end: startParam, quantity: 10000},
        {start: startParam, end: startParam, quantity: 20000},
        {start: startParam, end: startParam, quantity: 30000},
        {start: startParam, end: startParam, quantity: 40000},
        {start: startParam, end: startParam, quantity: 50000},
        {start: startParam, end: startParam, quantity: 60000},
        {start: startParam, end: startParam, quantity: 70000},
        {start: startParam, end: startParam, quantity: 80000},
        {start: startParam, end: startParam, quantity: 90000},
        {start: startParam, end: startParam, quantity: 10000},
        {start: startParam, end: startParam, quantity: 20000},
        {start: endParam, end: endParam, quantity: 30000},
      ],
    };

    return res(ctx.status(200), ctx.json(data));
  });
}
