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
import { rest } from 'msw';
import {
  MessageArchiveSearchResultItemDto,
} from '@energinet-datahub/dh/shared/domain';

export const messageArchiveMocks = [
  rest.post(
    'https://localhost:5001/v1/MessageArchive/SearchRequestResponseLogs',
    (req, res, ctx) => {
      const result: MessageArchiveSearchResultItemDto[] = [
        {
          messageId: '1',
          messageType: '2',
          processType: '3',
          businessSectorType: '4',
          reasonCode: '5',
          createdDate: '2022-10-09T22:00:00',
          logCreatedDate: '2022-10-09T22:01:00',
          senderGln: '8100000000016',
          senderGlnMarketRoleType: 'DDM',
          receiverGln: '5790000681075',
          receiverGlnMarketRoleType: 'DDQ',
          blobContentUri: 'some uri',
          httpData: 'data',
          invocationId: 'invocation id',
          functionName: 'function name',
          traceId: 'trace id',
          traceParent: 'trace parent',
          responseStatus: 'response status',
          originalTransactionIDReferenceId: 'original transaction Id reference',
          rsmName: 'rsm name',
          haveBodyContent: true,
          data: { key: '[string]' },
          errors: null,
        },
      ];
      return res(ctx.status(200), ctx.json(result));
    }
  ),
];
