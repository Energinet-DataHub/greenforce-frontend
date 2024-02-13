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

export const certificatesActivityLogResponse = {
  activityLogEntries: [
    {
      id: '9a99c225-a6cd-4f06-9522-b51608e6d91d',
      timestamp: 1707122980,
      actorId,
      actorType: 'User',
      actorName,
      organizationTin: '11223344',
      organizationName,
      entityType: 'MeteringPoint',
      actionType: 'EndDateChanged',
      entityId: '5079bf6c-c1b3-4810-b980-5538262f924d',
    },
    {
      id: 'b94e998d-0c51-4ec3-860a-b8346632282c',
      timestamp: 1707122982,
      actorId,
      actorType: 'User',
      actorName,
      organizationTin: '11223344',
      organizationName,
      entityType: 'MeteringPoint',
      actionType: 'Activated',
      entityId: 'fb3f95d9-aee7-40ae-9a81-93be21bc7f63',
    },
    {
      id: '67808d00-c897-4150-afca-9d9f4c723fb8',
      timestamp: 1707128431,
      actorId,
      actorType: 'User',
      actorName,
      organizationTin: '11223344',
      organizationName,
      entityType: 'MeteringPoint',
      actionType: 'EndDateChanged',
      entityId: '0036df54-119d-49e9-a341-aade7f660cd2',
    },
    {
      id: '87f5ba84-1e76-4147-a1b1-73e9c4f4c3b5',
      timestamp: 1707128432,
      actorId,
      actorType: 'User',
      actorName,
      organizationTin: '11223344',
      organizationName,
      entityType: 'MeteringPoint',
      actionType: 'EndDateChanged',
      entityId: 'fb3f95d9-aee7-40ae-9a81-93be21bc7f63',
    },
    {
      id: '5a0cb598-ace3-4a43-aeb2-a9abfbe86435',
      timestamp: 1707128432,
      actorId,
      actorType: 'User',
      actorName,
      organizationTin: '11223344',
      organizationName,
      entityType: 'MeteringPoint',
      actionType: 'EndDateChanged',
      entityId: '960d41ac-7d30-4763-968f-65ba6034ddfc',
    },
    {
      id: '229fa0eb-d448-4098-a038-845d2c25a923',
      timestamp: 1707128433,
      actorId,
      actorType: 'User',
      actorName,
      organizationTin: '11223344',
      organizationName,
      entityType: 'MeteringPoint',
      actionType: 'Activated',
      entityId: '96785cc7-46e3-456c-abd4-f4fc0f8b6aaa',
    },
    {
      id: 'a9217f8d-1a77-4d30-af03-dc6ba472c7dc',
      timestamp: 1707128434,
      actorId,
      actorType: 'User',
      actorName,
      organizationTin: '11223344',
      organizationName,
      entityType: 'MeteringPoint',
      actionType: 'Activated',
      entityId: 'd780a7cc-d8ff-4541-b33b-b56e1b8e7d49',
    },
    {
      id: '293be841-c796-4e75-b60a-75a52b95f767',
      timestamp: 1707128434,
      actorId,
      actorType: 'User',
      actorName,
      organizationTin: '11223344',
      organizationName,
      entityType: 'MeteringPoint',
      actionType: 'Activated',
      entityId: '9b7dc877-3f1d-4a7c-9df3-5939af67e55a',
    },
    {
      id: '6fd80783-ff60-4807-9f88-e012c34d74a9',
      timestamp: 1707287959,
      actorId,
      actorType: 'User',
      actorName,
      organizationTin: '11223344',
      organizationName,
      entityType: 'MeteringPoint',
      actionType: 'EndDateChanged',
      entityId: '96785cc7-46e3-456c-abd4-f4fc0f8b6aaa',
    },
    {
      id: '7e74c708-f86a-4b7c-b4a1-1fe5e02f9a25',
      timestamp: 1707287960,
      actorId,
      actorType: 'User',
      actorName,
      organizationTin: '11223344',
      organizationName,
      entityType: 'MeteringPoint',
      actionType: 'Activated',
      entityId: '284a12d1-3ba7-44c4-ab4c-4adb7081cc2d',
    },
    {
      id: '22fd863d-5b19-45a1-85cd-9f20c0c4049f',
      timestamp: 1707288954,
      actorId,
      actorType: 'User',
      actorName,
      organizationTin: '11223344',
      organizationName,
      entityType: 'MeteringPoint',
      actionType: 'EndDateChanged',
      entityId: '284a12d1-3ba7-44c4-ab4c-4adb7081cc2d',
    },
    {
      id: '690f7a69-b5e5-4be6-ad98-ae931c8b0c2f',
      timestamp: 1707290096,
      actorId,
      actorType: 'User',
      actorName,
      organizationTin: '11223344',
      organizationName,
      entityType: 'MeteringPoint',
      actionType: 'Activated',
      entityId: '00a01f0e-92f0-46ba-8c4c-88f47bd5dea5',
    },
  ],
  hasMore: false,
};
