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
import { SearchResult } from '@energinet-datahub/dh/shared/domain';

const messageId1 = '38374f50-f00c-4e2a-aec1-70d391cade06';
const messageId2 = '41c8490b-7a7b-45bd-b95b-87659964e7aa';
const messageId3 = '4f92c84e-d976-43f8-9df2-86d7d3adbf43';
const messageId4 = '51fa193b-9063-4d39-b8f0-e1966e851c05';
const messageId5 = '53afd9d8-c558-4a85-957c-26d5b0da5f1f';
const messageId6 = '5eafaa79-6307-48ea-8380-1f576d7c561f';
const messageId7 = '81f5667d-155f-44cf-b77a-ac748403defe';
const messageId8 = '894678e2-7b8a-4b93-a2eb-3498a118aeb1';
const rejectedMessageId = 'f23b0e28-f173-4348-b83f-b783fa3e5531';

export const messageArchiveSearchResponseLogs: SearchResult = {
  messages: [
    {
      messageId: messageId1,
      documentType: 'NotifyAggregatedMeasureData',
      createdDate: '2023-06-14T12:10:54.9519045+00:00',
      senderGln: '5790001330552',
      receiverGln: '7080000729821',
      id: messageId1,
    },
    {
      messageId: messageId2,
      documentType: 'NotifyAggregatedMeasureData',
      createdDate: '2023-06-14T12:25:02.6605962+00:00',
      senderGln: '5790001330552',
      receiverGln: '7080005056076',
      id: messageId2,
    },
    {
      messageId: messageId3,
      documentType: 'NotifyAggregatedMeasureData',
      createdDate: '2023-06-14T12:25:29.0746675+00:00',
      senderGln: '5790001330552',
      receiverGln: '7080005056076',
      id: messageId3,
    },
    {
      messageId: messageId4,
      documentType: 'NotifyAggregatedMeasureData',
      createdDate: '2023-06-14T12:23:53.6801627+00:00',
      senderGln: '5790001330552',
      receiverGln: '5790001687137',
      id: messageId4,
    },
    {
      messageId: messageId5,
      documentType: 'NotifyAggregatedMeasureData',
      createdDate: '2023-06-14T10:41:25.3732968+00:00',
      senderGln: '5790001330552',
      receiverGln: '5790001687137',
      id: messageId5,
    },
    {
      messageId: messageId6,
      documentType: 'NotifyAggregatedMeasureData',
      createdDate: '2023-06-14T12:24:13.9029624+00:00',
      senderGln: '5790001330552',
      receiverGln: '5790001687137',
      id: messageId6,
    },
    {
      messageId: messageId7,
      documentType: 'NotifyAggregatedMeasureData',
      createdDate: '2023-06-14T12:24:49.2059959+00:00',
      senderGln: '5790001330552',
      receiverGln: '7080005056076',
      id: messageId7,
    },
    {
      messageId: messageId8,
      documentType: 'NotifyAggregatedMeasureData',
      createdDate: '2023-06-14T12:26:48.7104608+00:00',
      senderGln: '5790001330552',
      receiverGln: '5706552000028',
      id: messageId8,
    },
    {
      messageId: '932b5654-520c-4b81-afdb-9c3e22ce7162',
      documentType: 'NotifyAggregatedMeasureData',
      createdDate: '2023-06-14T12:11:53.579528+00:00',
      senderGln: '5790001330552',
      receiverGln: '7080000729821',
      id: '932b5654-520c-4b81-afdb-9c3e22ce7b62',
    },
    {
      messageId: 'b87ee79b-eef6-4960-8f3a-3ce3d030ab7c',
      documentType: 'NotifyAggregatedMeasureData',
      createdDate: '2023-06-14T12:25:15.1479964+00:00',
      senderGln: '5790001330552',
      receiverGln: '7080005056076',
      id: 'b87ee79b-eef6-4960-8f3a-3ce7d030ab7c',
    },
    {
      messageId: 'c50b271a11d8-408f',
      documentType: 'NotifyAggregatedMeasureData',
      createdDate: '2023-06-14T12:12:08.6108809+00:00',
      senderGln: '5790001330552',
      receiverGln: '7080000729821',
      id: 'c50b271a-11d8-408f-b097-57894cbcffbb',
    },
    {
      messageId: 'ActorsMayWriteWhatever',
      documentType: 'RequestAggregatedMeasureData',
      createdDate: '2023-06-14T12:26:06.6019294+00:00',
      senderGln: '5790001330552',
      receiverGln: '5706552000028',
      id: 'cfaa0a2d-aac5-4359-b79a-bc7f6fcdc688',
    },
    {
      messageId: rejectedMessageId,
      documentType: 'RejectRequestAggregatedMeasureData',
      createdDate: '2023-06-14T12:12:29.5600357+00:00',
      senderGln: '5790001330552',
      receiverGln: '7080000729821',
      id: rejectedMessageId,
    },
    {
      documentType: 'RequestAggregatedMeasureData',
      createdDate: '2023-06-14T12:12:29.5600357+00:00',
      senderGln: '5790001330552',
      receiverGln: '7080000729821',
      id: 'f23b0e28-f173-4348-b83f-b783fa3e5531',
    },
  ],
};
