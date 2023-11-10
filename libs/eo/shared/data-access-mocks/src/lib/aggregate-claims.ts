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

export function aggregateClaimsMocks(apiBase: string) {
  return [getAggregateClaims(apiBase)];
}

function getAggregateClaims(apiBase: string) {
  return rest.get(`${apiBase}/v1/aggregate-claims`.replace('/api', '/wallet-api'), (req, res, ctx) => {

    const data = {
      result: [
        {start: 1, end: 1, quantity: 0},
        {start: 1, end: 1, quantity: 0},
        {start: 1, end: 1, quantity: 0},
        {start: 1, end: 1, quantity: 0},
        {start: 1, end: 1, quantity: 0},
        {start: 1, end: 1, quantity: 0},
        {start: 1, end: 1, quantity: 0},
        {start: 1, end: 1, quantity: 0},
        {start: 1, end: 1, quantity: 0},
        {start: 1, end: 1, quantity: 10000},
        {start: 1, end: 1, quantity: 20000},
        {start: 1, end: 1, quantity: 30000},
        {start: 1, end: 1, quantity: 40000},
        {start: 1, end: 1, quantity: 50000},
        {start: 1, end: 1, quantity: 60000},
        {start: 1, end: 1, quantity: 70000},
        {start: 1, end: 1, quantity: 80000},
        {start: 1, end: 1, quantity: 90000},
        {start: 1, end: 1, quantity: 10000 / 2},
        {start: 1, end: 1, quantity: 20000 / 2},
        {start: 1, end: 1, quantity: 30000 / 2},
        {start: 1, end: 1, quantity: 40000 / 2},
        {start: 1, end: 1, quantity: 50000 / 2},
        {start: 1, end: 1, quantity: 60000 / 2},
        {start: 1, end: 1, quantity: 70000 / 2},
        {start: 1, end: 1, quantity: 80000 / 2},
        {start: 1, end: 1, quantity: 90000 / 2},
        {start: 1, end: 1, quantity: 10000 / 2},
        {start: 1, end: 1, quantity: 0},
        {start: 1, end: 1, quantity: 0},
      ],
    };

    return res(ctx.status(200), ctx.json(data), ctx.delay(1000));
  });
}
