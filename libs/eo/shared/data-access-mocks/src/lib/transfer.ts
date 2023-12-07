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

export function transferMocks(apiBase: string) {
  return [
    getTransferAgreements(apiBase),
    getTransferAutomationStatus(apiBase),
    postTransferAgreementProposals(apiBase),
  ];
}

function getTransferAgreements(apiBase: string) {
  console.log(apiBase);
  return rest.get(`${apiBase}/transfer-agreements`, (req, res, ctx) => {
    const senderName = 'Producent A/S';
    const data = {
      result: [
        {
          id: '4ed4ed4c-930b-4ef6-99c2-b5300c024aff1',
          startDate: 1697796000,
          endDate: 1698400800,
          senderName,
          senderTin: '11223344',
          receiverTin: '11111111',
        },
        {
          id: '4ed4ed4c-930b-4ef6-99c2-b5300c024aff2',
          startDate: 1697796000,
          endDate: 1698400800,
          senderName,
          senderTin: '11223344',
          receiverTin: '22222222',
        },
        {
          id: '4ed4ed4c-930b-4ef6-99c2-b5300c024aff3',
          startDate: 1697796000,
          endDate: 1698400800,
          senderName,
          senderTin: '11223344',
          receiverTin: '33333333',
        },
      ],
    };

    return res(ctx.status(200), ctx.json(data));
  });
}

function postTransferAgreementProposals(apiBase: string) {
  return rest.post(`${apiBase}/transfer-agreement-proposals`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ result: '3fa85f64-5717-4562-b3fc-2c963f66afa6' }),
      ctx.delay(1000)
    );
  });
}

function getTransferAutomationStatus(apiBase: string) {
  return rest.get(`${apiBase}/transfer-automation/status`, (req, res, ctx) => {
    const data = { healthy: false };

    return res(ctx.status(200), ctx.json(data));
  });
}
