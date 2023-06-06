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
    id: '99f96d44-494b-439f-83fd-8846b13d22ad',
    startDate: new Date().setDate(new Date().getDate() - 60),
    endDate: new Date().setDate(new Date().getDate() + 60),
    receiverTin: '12345678',
    senderId: '11111111',
  },
  {
    id: '99f96d44-494b-439f-83fd-8846b13d22af',
    startDate: new Date().setDate(new Date().getDate() - 1),
    endDate: new Date().setDate(new Date().getDate() + 1),
    receiverTin: '23456789',
    senderId: '11111111',
  },
  {
    id: 'bb59b168-ee77-4c53-bfdc-1fe662b0e37b',
    startDate: new Date().setDate(new Date().getDate() - 1),
    endDate: new Date().getTime(),
    receiverTin: '98765432',
    senderId: '11111111',
  },
  {
    id: 'aa8c10d2-a1e6-4ee4-acf8-83dd5c829950',
    startDate: new Date().setDate(new Date().getDate() - 30),
    endDate: new Date().setDate(new Date().getDate() + 30),
    receiverTin: '63936234',
    senderId: '11111111',
  },
  {
    id: 'e6203a14-22f7-4d39-ada4-1f474fb0a7eb',
    startDate: new Date().setDate(new Date().getDate() - 60),
    endDate: new Date().setDate(new Date().getDate() + 60),
    receiverTin: '98367454',
    senderId: '11111111',
  },
  {
    id: 'b1b23e16-724a-4336-88ed-7c3b6c822308',
    startDate: new Date().setDate(new Date().getDate() - 1),
    endDate: new Date().setDate(new Date().getDate() + 1),
    receiverTin: '23489755',
    senderId: '11111111',
  },
  {
    id: '97d2cf6d-3f47-4990-b86f-00799d74331d',
    startDate: new Date().setDate(new Date().getDate() - 1),
    endDate: new Date().getTime(),
    receiverTin: '34239873',
    senderId: '11111111',
  },
  {
    id: '373172e3-fa1b-4956-b68d-a25962f642fd',
    startDate: new Date().setDate(new Date().getDate() - 30),
    endDate: new Date().setDate(new Date().getDate() + 30),
    receiverTin: '32897344',
    senderId: '11111111',
  },
  {
    id: '5081a03b-685a-4f1b-8dc4-f0fe9c6086b7',
    startDate: new Date().setDate(new Date().getDate() - 60),
    endDate: new Date().setDate(new Date().getDate() + 60),
    receiverTin: '12398753',
    senderId: '11111111',
  },
  {
    id: 'e8f04df0-f332-456d-ac45-648ed5e6c397',
    startDate: new Date().setDate(new Date().getDate() - 1),
    endDate: new Date().setDate(new Date().getDate() + 1),
    receiverTin: '65238973',
    senderId: '11111111',
  },
  {
    id: '4b45e796-70da-4333-9372-4529d05b308d',
    startDate: new Date().setDate(new Date().getDate() - 1),
    endDate: new Date().getTime(),
    receiverTin: '92342344',
    senderId: '11111111',
  },
  {
    id: '91d9a1c1-11fa-4d76-96f8-940d9ac945c8',
    startDate: new Date().setDate(new Date().getDate() - 30),
    endDate: new Date().setDate(new Date().getDate() + 30),
    receiverTin: '82348762',
    senderId: '11111111',
  },
];
