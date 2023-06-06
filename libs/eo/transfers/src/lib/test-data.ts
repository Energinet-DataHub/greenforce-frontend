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
export const testData = [
  {
    id: 'test4',
    startDate: new Date().setDate(new Date().getDate() - 60),
    endDate: new Date().setDate(new Date().getDate() + 60),
    receiverTin: '12345678',
    senderId: '11111111',
  },
  {
    id: 'test1',
    startDate: new Date().setDate(new Date().getDate() - 1),
    endDate: new Date().setDate(new Date().getDate() + 1),
    receiverTin: '23456789',
    senderId: '11111111',
  },
  {
    id: 'test2',
    startDate: new Date().setDate(new Date().getDate() - 1),
    endDate: new Date().getTime(),
    receiverTin: '98765432',
    senderId: '11111111',
  },
  {
    id: 'test3',
    startDate: new Date().setDate(new Date().getDate() - 30),
    endDate: new Date().setDate(new Date().getDate() + 30),
    receiverTin: '63936234',
    senderId: '11111111',
  },
  {
    id: 'test5',
    startDate: new Date().setDate(new Date().getDate() - 60),
    endDate: new Date().setDate(new Date().getDate() + 60),
    receiverTin: '98367454',
    senderId: '11111111',
  },
  {
    id: 'test6',
    startDate: new Date().setDate(new Date().getDate() - 1),
    endDate: new Date().setDate(new Date().getDate() + 1),
    receiverTin: '23489755',
    senderId: '11111111',
  },
  {
    id: 'test7',
    startDate: new Date().setDate(new Date().getDate() - 1),
    endDate: new Date().getTime(),
    receiverTin: '34239873',
    senderId: '11111111',
  },
  {
    id: 'test8',
    startDate: new Date().setDate(new Date().getDate() - 30),
    endDate: new Date().setDate(new Date().getDate() + 30),
    receiverTin: '32897344',
    senderId: '11111111',
  },
  {
    id: 'test9',
    startDate: new Date().setDate(new Date().getDate() - 60),
    endDate: new Date().setDate(new Date().getDate() + 60),
    receiverTin: '12398753',
    senderId: '11111111',
  },
  {
    id: 'test10',
    startDate: new Date().setDate(new Date().getDate() - 1),
    endDate: new Date().setDate(new Date().getDate() + 1),
    receiverTin: '65238973',
    senderId: '11111111',
  },
  {
    id: 'test11',
    startDate: new Date().setDate(new Date().getDate() - 1),
    endDate: new Date().getTime(),
    receiverTin: '92342344',
    senderId: '11111111',
  },
  {
    id: 'test12',
    startDate: new Date().setDate(new Date().getDate() - 30),
    endDate: new Date().setDate(new Date().getDate() + 30),
    receiverTin: '82348762',
    senderId: '11111111',
  },
];
