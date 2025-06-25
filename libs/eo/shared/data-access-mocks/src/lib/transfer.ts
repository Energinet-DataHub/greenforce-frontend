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
//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the ''License2'');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an ''AS IS'' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion
import { delay, http, HttpResponse } from 'msw';
import { transferActivityLogResponse } from './data/activity-logs';
import { addDays, getUnixTime, subDays } from 'date-fns';

export function transferMocks(apiBase: string) {
  return [
    getTransferAgreements(apiBase),
    getTransferAgreementsFromPOA(apiBase),
    postTransferAgreementProposals(apiBase),
    getTransferAgreementHistory(apiBase),
    putTransferAgreements(apiBase),
    postTransferActivityLog(apiBase),
    postTransferAgreement(apiBase),
  ];
}

const enum Users {
  CharlotteCSR = '39293595',
  IvanIvaerksaetter = '12345678',
  PeterProducent = '11223344',
  FrankFabrikant = '55555555',
  BrianBoligHaj = '66666666',
  ViggoVindmolle = '77777777',
  ErikEnerginet = '28980671',
}

const senderName = 'Producent A/S';
type transferAgreementStatus = 'Active' | 'Inactive' | 'Proposal' | 'ProposalExpired';
interface TransferAgreement {
  id: string;
  startDate: number;
  endDate?: number;
  senderName: string;
  senderTin: string;
  receiverTin: string;
  transferAgreementStatus: transferAgreementStatus;
}

const activeTransferAgreement: TransferAgreement = {
  id: 'f44211b2-78fa-4fa0-9215-23369abf24ea',
  startDate: getUnixTime(subDays(new Date(), 10)),
  endDate: getUnixTime(addDays(new Date(), 10)),
  senderName,
  senderTin: Users.PeterProducent,
  receiverTin: Users.IvanIvaerksaetter,
  transferAgreementStatus: 'Active',
};

const activeTransferAgreementNotSender: TransferAgreement = {
  id: 'f44211b2-78fa-4fa0-9215-23369abf24eb',
  startDate: getUnixTime(subDays(new Date(), 10)),
  endDate: getUnixTime(addDays(new Date(), 10)),
  senderName: 'Ukendt virksomhed',
  senderTin: Users.CharlotteCSR,
  receiverTin: Users.PeterProducent,
  transferAgreementStatus: 'Active',
};

const inactiveTransferAgreement = {
  id: '0f190d46-7736-4f71-ad07-63dbaeeb689a',
  startDate: getUnixTime(addDays(new Date(), 10)),
  senderName,
  senderTin: Users.PeterProducent,
  receiverTin: Users.FrankFabrikant,
  transferAgreementStatus: 'Inactive',
};

const transferAgreementProposal = {
  id: '8892efde-2d14-48a5-85ad-85cb45386790',
  startDate: getUnixTime(addDays(new Date(), 5)),
  endDate: getUnixTime(addDays(new Date(), 11)),
  senderName,
  senderTin: Users.PeterProducent,
  receiverTin: Users.BrianBoligHaj,
  transferAgreementStatus: 'Proposal',
};

const transferAgreementProposalExpired = {
  id: 'fe1a2948-a2eb-4464-b6bc-c0be0289b1cc',
  startDate: getUnixTime(subDays(new Date(), 30)),
  endDate: getUnixTime(subDays(new Date(), 10)),
  senderName,
  senderTin: Users.PeterProducent,
  receiverTin: Users.ErikEnerginet,
  transferAgreementStatus: 'ProposalExpired',
};

function getTransferAgreements(apiBase: string) {
  return http.get(`${apiBase}/transfer/transfer-agreements/overview`, async () => {
    const data = {
      result: [
        activeTransferAgreement,
        activeTransferAgreementNotSender,
        inactiveTransferAgreement,
        transferAgreementProposal,
        transferAgreementProposalExpired,
      ],
    };
    await delay(1000);

    return HttpResponse.json(data, { status: 200 });
  });
}

function getTransferAgreementsFromPOA(apiBase: string) {
  return http.get(`${apiBase}/transfer/transfer-agreements/overview/consent`, async () => {
    const data = {
      result: [activeTransferAgreement],
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

function getTransferAgreementHistory(apiBase: string) {
  return http.get(`${apiBase}/transfer/transfer-agreements/:id/history`, async () => {
    const data = {
      totalCount: 2,
      items: [
        {
          transferAgreement: {
            id: '4f75771b-3c16-405a-99c4-4f555cf93325',
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

function postTransferAgreement(apiBase: string) {
  return http.post(`${apiBase}/transfer/transfer-agreements/create`, () => {
    const data = {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      startDate: 0,
      endDate: 0,
      senderName: 'string',
      senderTin: 'string',
      receiverTin: 'string',
      type: 'TransferAllCertificates',
    };
    return HttpResponse.json(data, { status: 200 });
  });
}
