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
    getTransferAgreementHistory(apiBase),
  ];
}

function getTransferAgreements(apiBase: string) {
  return rest.get(`${apiBase}/transfer-agreements`, (req, res, ctx) => {
    const data = {
      result: [
        {
          id: 'f44211b2-78fa-4fa0-9215-23369abf24ea',
          startDate: 1702371600,
          endDate: 1702396800,
          senderName: 'Producent A/S',
          senderTin: '11223344',
          receiverTin: '39293595',
        },
        {
          id: '0f190d46-7736-4f71-ad07-63dbaeeb689a',
          startDate: 1702371600,
          endDate: 1702378800,
          senderName: 'Producent A/S',
          senderTin: '11223344',
          receiverTin: '12345678',
        },
      ],
    };

    return res(ctx.status(200), ctx.delay(1000), ctx.json(data));
  });
}

function postTransferAgreementProposals(apiBase: string) {
  return rest.post(`${apiBase}/transfer-agreement-proposals`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.delay(1000),
      ctx.json({ id: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
    );
  });
}

function getTransferAutomationStatus(apiBase: string) {
  return rest.get(`${apiBase}/transfer-automation/status`, (req, res, ctx) => {
    const data = { healthy: false };

    return res(ctx.status(200), ctx.json(data));
  });
}

function getTransferAgreementHistory(apiBase: string) {
  return rest.get(`${apiBase}/transfer-agreements/:id/history`, (req, res, ctx) => {
    const data = {
      totalCount: 1,
      items: [
        {
          transferAgreement: {
            id: 'd7786904-f78b-47ed-a8cf-f1861eeecae1',
            startDate: 1701770400,
            endDate: null,
            senderName: 'Producent A/S',
            senderTin: '11223344',
            receiverTin: '28980671',
          },
          createdAt: 1701767171,
          action: 'Created',
          actorName: 'Erik Energinet',
        },
      ],
    };

    return res(ctx.status(200), ctx.json(data), ctx.delay(1000));
  });
}
