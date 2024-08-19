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
import { User, UserStatus } from '@energinet-datahub/dh/shared/domain/graphql';

export const overviewUsers: User[] = [
  {
    __typename: 'User',
    id: '1',
    email: 'test@test.dk',
    firstName: 'Test',
    lastName: 'Test',
    status: UserStatus.Active,
    phoneNumber: '+45 12345678',
    createdDate: new Date(),
    name: 'Test Test',
  },
  {
    __typename: 'User',
    id: '2',
    email: 'test1@test1.dk',
    firstName: 'Test1',
    lastName: 'Test1',
    status: UserStatus.Inactive,
    phoneNumber: '+45 22345678',
    createdDate: new Date(),
    name: 'Test1 Test1',
  },
  {
    __typename: 'User',
    id: '3',
    email: 'test1@test2.dk',
    firstName: 'Test2',
    lastName: 'Test2',
    status: UserStatus.InviteExpired,
    phoneNumber: '+45 32345678',
    createdDate: new Date(),
    name: 'Test2 Test2',
  },
  {
    __typename: 'User',
    id: '4',
    email: 'test1@test3.dk',
    firstName: 'Test3',
    lastName: 'Test3',
    status: UserStatus.Invited,
    phoneNumber: '+45 34345678',
    createdDate: new Date(),
    name: 'Test3 Test3',
  },
  {
    __typename: 'User',
    id: '5',
    email: 'test1@test4.dk',
    firstName: 'Test4',
    lastName: 'Test4',
    status: UserStatus.Invited,
    phoneNumber: null,
    createdDate: new Date(),
    name: 'Test4 Test4',
  },
];
