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
import { transferActivityLogResponse } from './data/activity-logs';

export function transferMocks(apiBase: string) {
  return [
    getTransferAgreements(apiBase),
    getTransferAutomationStatus(apiBase),
    postTransferAgreementProposals(apiBase),
    getTransferAgreementHistory(apiBase),
    putTransferAgreements(apiBase),
    postTransferActivityLog(apiBase),
  ];
}

const senderName = 'Producent A/S';

function getTransferAgreements(apiBase: string) {
  return http.get(`${apiBase}/transfer/transfer-agreements`, async () => {
    const data = {
      result: [
        {
          id: 'f44211b2-78fa-4fa0-9215-23369abf24ea',
          startDate: 1702371600,
          endDate: 1702396800,
          senderName,
          senderTin: '11223344',
          receiverTin: '39293595',
        },
        {
          id: '0f190d46-7736-4f71-ad07-63dbaeeb689a',
          startDate: 1702371600,
          endDate: 1702378800,
          senderName,
          senderTin: '11223344',
          receiverTin: '12345678',
        },
        {
          id: '8892efde-2d14-48a5-85ad-85cb45386790',
          startDate: 1702382400,
          endDate: 1702386000,
          senderName,
          senderTin: '11223344',
          receiverTin: '12345678',
        },
        {
          id: 'fe1a2948-a2eb-4464-b6bc-c0be0289b1cc',
          startDate: 1702407600,
          endDate: 1702443600,
          senderName,
          senderTin: '11223344',
          receiverTin: '39293595',
        },
        {
          id: 'b1dd65a9-ded0-4ff2-bf4e-fb04c8bf6b1e',
          startDate: 1702393200,
          endDate: 1702411200,
          senderName,
          senderTin: '11223344',
          receiverTin: '12345678',
        },
        {
          id: 'e31acbac-d26d-4c5b-aaa4-98fb49c740c5',
          startDate: 1702414800,
          endDate: 1702440000,
          senderName,
          senderTin: '11223344',
          receiverTin: '12345678',
        },
        {
          id: '427e47ed-47b3-45f0-8d62-e2a9930090f0',
          startDate: 1702447200,
          endDate: 1702533600,
          senderName,
          senderTin: '11223344',
          receiverTin: '12345678',
        },
        {
          id: '3e3b749b-6149-4e34-bc6e-a13ffed0f28c',
          startDate: 1702537200,
          endDate: 1702551600,
          senderName,
          senderTin: '11223344',
          receiverTin: '12345678',
        },
      ],
    };
    await delay(1000);

    return HttpResponse.json(data, { status: 200 });
  });
}

function postTransferAgreementProposals(apiBase: string) {
  return http.post(`${apiBase}/transfer/transfer-agreement-proposals`, () => {
    return HttpResponse.json({ id: '3fa85f64-5717-4562-b3fc-2c963f66afa6' }, { status: 200 });
  });
}

function getTransferAutomationStatus(apiBase: string) {
  return http.get(`${apiBase}/transfer-automation/status`, () => {
    const data = { healthy: false };

    return HttpResponse.json(data, { status: 200 });
  });
}

function getTransferAgreementHistory(apiBase: string) {
  return http.get(`${apiBase}/transfer/transfer-agreements/:id/history`, async () => {
    const data = {
      totalCount: 2,
      items: [
        {
          transferAgreement: {
            id: '4f75771b-3c16-405a-99c4-4f555cf93322',
            startDate: 1701867600,
            endDate: null,
            senderName,
            senderTin: '11223344',
            receiverTin: '39293595',
          },
          createdAt: 1701866501,
          action: 'Created',
          actorName: 'Charlotte C.S. Rasmussen',
        },
        {
          transferAgreement: {
            id: '8c490c77-21e8-4f58-b101-4058b96236af',
            startDate: 1701867600,
            endDate: 1702299600,
            senderName,
            senderTin: '11223344',
            receiverTin: '39293595',
          },
          createdAt: 1701949899,
          action: 'Updated',
          actorName: 'Peter Producent',
        },
      ],
    };
    await delay(1000);

    return HttpResponse.json(data, { status: 200 });
  });
}

function putTransferAgreements(apiBase: string) {
  return http.put(`${apiBase}/transfer/transfer-agreements/:id`, async () => {
    const data = {
      id: '72395d38-50d9-4038-b39c-ef343ee11e93',
      startDate: 1701770400,
      endDate: 1702508400,
      senderName,
      senderTin: '11223344',
      receiverTin: '28980671',
    };
    await delay(1000);

    return HttpResponse.json(data, { status: 200 });
  });
}

function postTransferActivityLog(apiBase: string) {
  return http.post(`${apiBase}/transfer/activity-log`, () => {
    const state = localStorage.getItem('transfer-activity-log');

    if (state === 'no-log-entries') {
      return HttpResponse.json({ activityLogEntries: [] });
    } else if (state === 'activity-log-has-error') {
      return HttpResponse.error();
    } else {
      return HttpResponse.json(transferActivityLogResponse);
    }
  });
}
