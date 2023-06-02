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
    dateFrom: new Date().setDate(new Date().getDate() - 60),
    dateTo: new Date().setDate(new Date().getDate() + 60),
    recipient: 'Makerspace',
  },
  {
    id: 'test1',
    dateFrom: new Date().setDate(new Date().getDate() - 1),
    dateTo: new Date().setDate(new Date().getDate() + 1),
    recipient: 'København Ø',
  },
  {
    id: 'test2',
    dateFrom: new Date().setDate(new Date().getDate() - 1),
    dateTo: new Date().getTime(),
    recipient: 'Fredericia Strøm',
  },
  {
    id: 'test3',
    dateFrom: new Date().setDate(new Date().getDate() - 30),
    dateTo: new Date().setDate(new Date().getDate() + 30),
    recipient: 'Odense kraftværk',
  },
  {
    id: 'test5',
    dateFrom: new Date().setDate(new Date().getDate() - 60),
    dateTo: new Date().setDate(new Date().getDate() + 60),
    recipient: 'Dammens el',
  },
  {
    id: 'test6',
    dateFrom: new Date().setDate(new Date().getDate() - 1),
    dateTo: new Date().setDate(new Date().getDate() + 1),
    recipient: "Anders' strøm",
  },
  {
    id: 'test7',
    dateFrom: new Date().setDate(new Date().getDate() - 1),
    dateTo: new Date().getTime(),
    recipient: 'Andeby el privat',
  },
  {
    id: 'test8',
    dateFrom: new Date().setDate(new Date().getDate() - 30),
    dateTo: new Date().setDate(new Date().getDate() + 30),
    recipient: 'Andeby el erhverv',
  },
  {
    id: 'test9',
    dateFrom: new Date().setDate(new Date().getDate() - 60),
    dateTo: new Date().setDate(new Date().getDate() + 60),
    recipient: 'Dammens el',
  },
  {
    id: 'test10',
    dateFrom: new Date().setDate(new Date().getDate() - 1),
    dateTo: new Date().setDate(new Date().getDate() + 1),
    recipient: "Anders' strøm",
  },
  {
    id: 'test11',
    dateFrom: new Date().setDate(new Date().getDate() - 1),
    dateTo: new Date().getTime(),
    recipient: 'Andeby el privat',
  },
  {
    id: 'test12',
    dateFrom: new Date().setDate(new Date().getDate() - 30),
    dateTo: new Date().setDate(new Date().getDate() + 30),
    recipient: 'Andeby el erhverv',
  },
];
