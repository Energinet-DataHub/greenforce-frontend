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
const actorId = 'ACTOR_ID';
const actorName = 'ACTOR_NAME';
const organizationName = 'ORGANIZATION_NAME';

export const transferActivityLogResponse = {
  activityLogEntries: [
    {
      id: '94aea637-587c-47b3-9ae1-1ab06a1096f1',
      timestamp: 1707123316,
      actorId,
      actorType: 'User',
      actorName,
      organizationTin: '11223344',
      organizationName,
      entityType: 'TransferAgreementProposal',
      actionType: 'Created',
      entityId: 'bfe37f32-2419-46f8-bd3e-ca83f2667b12',
    },
    {
      id: '192320ca-daf5-498e-b9ea-9355079c0ec1',
      timestamp: 1707123369,
      actorId,
      actorType: 'User',
      actorName,
      organizationTin: '11223344',
      organizationName,
      entityType: 'TransferAgreementProposal',
      actionType: 'Created',
      entityId: '7775372b-a7e5-49ec-9351-5316f46b66fa',
    },
    {
      id: 'b50eb14e-81da-483d-9855-611afe72e1c4',
      timestamp: 1707132935,
      actorId,
      actorType: 'User',
      actorName,
      organizationTin: '11223344',
      organizationName,
      entityType: 'TransferAgreementProposal',
      actionType: 'Created',
      entityId: 'f69fe9d6-231d-4740-9c25-29f6b6d08dcc',
    },
    {
      id: 'a0cca5bf-eca7-4e43-a8e0-70bbc996676f',
      timestamp: 1707288662,
      actorId,
      actorType: 'User',
      actorName,
      organizationTin: '11223344',
      organizationName,
      entityType: 'TransferAgreementProposal',
      actionType: 'Created',
      entityId: 'a5d36cb4-5ad4-47b5-b176-f1664192b105',
    },
    {
      id: 'fc183df1-173e-4f1a-954d-1255b4605533',
      timestamp: 1707292320,
      actorId,
      actorType: 'User',
      actorName,
      organizationTin: '11223344',
      organizationName,
      entityType: 'TransferAgreementProposal',
      actionType: 'Created',
      entityId: 'f5e24cac-68ed-4951-9e7c-5024a0f02621',
    },
    {
      id: 'e96ddc04-aad1-4073-b57f-86e81f9e6c69',
      timestamp: 1707292338,
      actorId: '95d7be81-0cfb-4b52-9c92-33a45747fcef',
      actorType: 'User',
      actorName: 'Charlotte C.S. Rasmussen',
      organizationTin: '11223344',
      organizationName,
      entityType: 'TransferAgreement',
      actionType: 'Created',
      entityId: '41159958-f609-434c-af34-78c0742ed0bb',
    },
    {
      id: '9e5267fd-c1d7-4977-817e-313f58ac71d6',
      timestamp: 1707311541,
      actorId,
      actorType: 'User',
      actorName,
      organizationTin: '11223344',
      organizationName,
      entityType: 'TransferAgreementProposal',
      actionType: 'Created',
      entityId: '9475a256-d71e-4d59-97a8-01875d05e3fe',
    },
  ],
  hasMore: false,
};
