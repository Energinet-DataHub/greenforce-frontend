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
import { MarketParticipantGetUserOverviewResponse } from '@energinet-datahub/dh/shared/domain';

export const marketParticipantUserSearchUsers: MarketParticipantGetUserOverviewResponse = {
  totalUserCount: 4,
  users: [
    {
      id: '3ec41d91-fc6d-4364-ade6-b85576a91d04',
      email: 'testuser1@test.dk',
      firstName: 'Test',
      lastName: 'User 1',
      phoneNumber: '+45 12345678',
      createdDate: '2022-01-01T23:00:00Z',
      status: 'Active',
    },
    {
      id: 'f73d05cd-cb00-4be3-89b2-115c8425b837',
      email: 'testuser2@test.dk',
      firstName: 'Test',
      lastName: 'User 2',
      phoneNumber: null,
      createdDate: '2022-06-01T22:00:00Z',
      status: 'Inactive',
    },
    {
      id: '48a2b6f0-59a8-4ef1-87e2-15e8c93fbe3b',
      email: 'testuser3@test.dk',
      firstName: 'Test',
      lastName: 'User 3',
      phoneNumber: '+45 87654321',
      createdDate: '2022-07-01T22:00:00Z',
      status: 'Invited',
    },
    {
      id: '8c2cf14f-05ec-44d8-91a8-e5ccbe108e5e',
      email: 'testuser4@test.dk',
      firstName: 'Test',
      lastName: 'User 4',
      phoneNumber: null,
      createdDate: '2022-12-01T23:00:00Z',
      status: 'InviteExpired',
    },
  ],
};
