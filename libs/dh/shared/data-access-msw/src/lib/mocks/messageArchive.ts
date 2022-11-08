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
import { MessageArchiveSearchResultsDto } from '@energinet-datahub/dh/shared/domain';

export function messageArchiveMocks(apiBase: string) {
  return [
    rest.post(
      `${apiBase}/v1/MessageArchive/SearchRequestResponseLogs`,
      (req, res, ctx) => {
        const result: MessageArchiveSearchResultsDto = {
          continuationToken: '',
          result: [
            {
              messageId: 'DocId2022-09-19T06:42:08Z',
              messageType: 'D10',
              processType: 'D18',
              businessSectorType: '23',
              reasonCode: '',
              createdDate: '2022-09-19T06:42:08+00:00',
              logCreatedDate: '2022-09-19T06:42:07+00:00',
              senderGln: '8100000000030',
              senderGlnMarketRoleType: 'DDM',
              receiverGln: '5790001330552',
              receiverGlnMarketRoleType: 'DDZ',
              blobContentUri: `${apiBase}/marketoplogs-archive/273f329a-abcf-46da-a7e5-6a4a28e0911c`,
              httpData: 'request',
              invocationId: '294410e4-75a1-41f5-acd6-78ea0aaa18ae',
              functionName: 'ChargeIngestion',
              traceId: 'c53db521d757874fa0f8d4c091608e98',
              traceParent:
                '00-c53db521d757874fa0f8d4c091608e98-729896ec82938b96-01',
              responseStatus: '',
              originalTransactionIDReferenceId: null,
              rsmName: 'requestchangeofpricelist',
              haveBodyContent: true,
              data: {
                key: '{functionname}',
                value: 'ChargeIngestion',
              },
              errors: null,
            },
          ],
        };
        return res(ctx.status(200), ctx.json(result));
      }
    ),
  ];
}
