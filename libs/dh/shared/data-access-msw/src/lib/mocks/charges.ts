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
import { ChargeV1Dto } from '@energinet-datahub/dh/shared/domain';

export function chargesMocks(apiBase: string) {
  return [
    rest.get(`${apiBase}/v1/ChargeLinks`, (req, res, ctx) => {
      return res(ctx.status(404));
    }),
    rest.get(`${apiBase}/v1/Charges`, (req, res, ctx) => {
      const result: ChargeV1Dto[] = [
        {
          chargeType: 'D01',
          resolution: 'PT15M',
          taxIndicator: false,
          transparentInvoicing: true,
          validFromDateTime: '2022-09-29T22:00:00',
          validToDateTime: '2022-10-29T22:00:00',
          chargeId: '0AA1F',
          chargeName: 'Net abo A høj Forbrug',
          chargeOwner: '5790000681075',
          chargeOwnerName: 'Thy-Mors Energi Elnet A/S - 042',
        },
      ];
      return res(ctx.status(200), ctx.json(result));
    }),
    rest.post(`${apiBase}/v1/Charges/SearchASync`, (req, res, ctx) => {
      const result: ChargeV1Dto[] = [
        {
          chargeType: 'D01',
          resolution: 'PT15M',
          taxIndicator: false,
          transparentInvoicing: true,
          validFromDateTime: '2022-09-29T22:00:00',
          validToDateTime: '2022-10-29T22:00:00',
          chargeId: '0AA1F',
          chargeName: 'Net abo A høj Forbrug',
          chargeOwner: '5790000681075',
          chargeOwnerName: 'Thy-Mors Energi Elnet A/S - 042',
        },
      ];
      return res(ctx.status(200), ctx.json(result));
    }),
  ];
}
