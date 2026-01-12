//#region License
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
//#endregion
import { DefaultBodyType, delay, http, HttpResponse, StrictResponse } from 'msw';

import { mswConfig } from '@energinet-datahub/gf/util-msw';
import {
  DocumentType,
  ProcessState,
  ProcessStepType,
  WorkflowAction,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  mockGetArchivedMessagesQuery,
  mockGetArchivedMessagesForMeteringPointQuery,
  mockGetMeteringPointProcessOverviewQuery,
  mockGetMeteringPointProcessByIdQuery,
} from '@energinet-datahub/dh/shared/domain/graphql/msw';

import { messageArchiveSearchResponseLogs } from './data/message-archive-search-response-logs';
import { document, documentJson } from './data/message-archived-document';

export function messageArchiveMocks(apiBase: string) {
  return [
    getDocumentById(apiBase),
    getArchivedMessages(apiBase),
    getArchivedMessagesForMeteringPoint(apiBase),
    getMeteringPointProcessOverview(),
    getMeteringPointProcessById(apiBase),
  ];
}

export function getDocumentById(apiBase: string) {
  return http.get(
    `${apiBase}/v1/MessageArchive/Document`,
    async (): Promise<StrictResponse<DefaultBodyType>> => {
      await delay(mswConfig.delay);
      const random = Math.floor(Math.random() * 1000);
      return random % 2 === 0
        ? HttpResponse.text(document, { headers: { 'Content-Type': 'text/xml' } })
        : HttpResponse.json(documentJson, { headers: { 'Content-Type': 'application/json' } });
    }
  );
}

function getArchivedMessages(apiBase: string) {
  return mockGetArchivedMessagesQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        archivedMessages: {
          __typename: 'ArchivedMessagesConnection',
          pageInfo: {
            __typename: 'PageInfo',
            startCursor: 'startCursor',
            endCursor: 'endCursor',
          },
          totalCount: messageArchiveSearchResponseLogs.messages.length,
          nodes: messageArchiveSearchResponseLogs.messages.map((m) => ({
            __typename: 'ArchivedMessage',
            id: m.id,
            messageId: m.messageId,
            documentType: m.documentType,
            receiver: {
              __typename: 'MarketParticipant',
              id: '8698f30b-5e9d-4f70-9e8b-ce79d8b1b303',
              glnOrEicNumber: m.receiverGln ?? '',
              displayName: 'Energinet DataHub',
            },
            sender: {
              __typename: 'MarketParticipant',
              id: '8698f30b-5e9d-4f70-9e8b-ce79d8b1b303',
              glnOrEicNumber: m.senderGln ?? '',
              displayName: 'Energinet DataHub',
            },
            createdAt: m.createdDate ? new Date(m.createdDate) : new Date(),
            documentUrl: `${apiBase}/v1/MessageArchive/Document?id=${m.id}`,
          })),
        },
      },
    });
  });
}

function getArchivedMessagesForMeteringPoint(apiBase: string) {
  return mockGetArchivedMessagesForMeteringPointQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: {
        __typename: 'Query',
        archivedMessagesForMeteringPoint: {
          __typename: 'ArchivedMessagesForMeteringPointConnection',
          pageInfo: {
            __typename: 'PageInfo',
            startCursor: 'startCursor',
            endCursor: 'endCursor',
          },
          totalCount: messageArchiveSearchResponseLogs.messages.length,
          nodes: messageArchiveSearchResponseLogs.messages.map((m) => ({
            __typename: 'ArchivedMessage',
            id: m.id,
            messageId: m.messageId,
            documentType: DocumentType.SendMeasurements,
            receiver: {
              __typename: 'MarketParticipant',
              id: '8698f30b-5e9d-4f70-9e8b-ce79d8b1b303',
              glnOrEicNumber: m.receiverGln ?? '',
              displayName: 'Energinet DataHub',
            },
            sender: {
              __typename: 'MarketParticipant',
              id: '8698f30b-5e9d-4f70-9e8b-ce79d8b1b303',
              glnOrEicNumber: m.senderGln ?? '',
              displayName: 'Energinet DataHub',
            },
            createdAt: m.createdDate ? new Date(m.createdDate) : new Date(),
            documentUrl: `${apiBase}/v1/MessageArchive/Document?id=${m.id}`,
          })),
        },
      },
    });
  });
}

function getMeteringPointProcessOverview() {
  return mockGetMeteringPointProcessOverviewQuery(async () => {
    await delay(mswConfig.delay);

    // Generate more varied mock data for testing sorting
    const reasonCodes = [
      'MoveIn',
      'BalanceFixing',
      'WholesaleFixing',
      'EndOfSupply',
      'CorrectMasterData',
      'ChangeMeteringMethod',
      'ChangeSupplier',
      'ConnectionStatusUpdate',
      'NewMeteringPoint',
      'ConnectMeteringPoint',
    ];

    const states = [
      ProcessState.Pending,
      ProcessState.Running,
      ProcessState.Succeeded,
      ProcessState.Failed,
      ProcessState.Canceled,
    ];

    const initiators = [
      { id: '0199ed3d-f1b2-7180-9546-39b5836fb575', displayName: '905495045940594 • Radius' },
      { id: '0199ed3d-f1b2-7180-9546-39b5836fb576', displayName: '5790001330552 • Energinet' },
      { id: '0199ed3d-f1b2-7180-9546-39b5836fb577', displayName: '7080005056076 • Andel' },
      { id: '0199ed3d-f1b2-7180-9546-39b5836fb578', displayName: '5790001687137 • Ørsted' },
      {
        id: '0199ed3d-f1b2-7180-9546-39b5836fb579',
        displayName: '5706552000028 • Clever Energy',
      },
    ];

    // Create base date for generating varied dates
    const baseDate = new Date('2025-01-01T10:00:00Z');

    const actions = [WorkflowAction.SendInformation, WorkflowAction.CancelWorkflow];

    // Generate 30 mock processes with varied data
    const mockProcesses = Array.from({ length: 30 }, (_, index) => {
      // Vary created date - spread over 60 days
      const daysOffset = Math.floor(index * 2);
      const hoursOffset = (index * 3) % 24;
      const createdAt = new Date(baseDate);
      createdAt.setDate(createdAt.getDate() + daysOffset);
      createdAt.setHours(createdAt.getHours() + hoursOffset);

      // Add actions to some processes (not failed/canceled/succeeded ones)
      const currentState = states[index % states.length];
      const hasNoActions =
        currentState === ProcessState.Failed ||
        currentState === ProcessState.Canceled ||
        currentState === ProcessState.Succeeded;
      const availableActions = hasNoActions ? [] : [actions[index % actions.length]];

      // Vary cutoff date - typically a few days after created date
      let cutoffDate = null;

      console.log('currentState', currentState);
      if(currentState != ProcessState.Pending) {
        cutoffDate = new Date(createdAt);
        cutoffDate.setDate(cutoffDate.getDate() + ((index % 5) + 1));
      }

      return {
        __typename: 'MeteringPointProcess' as const,
        id: `process-${String(index + 1).padStart(3, '0')}`,
        reasonCode: reasonCodes[index % reasonCodes.length],
        createdAt,
        cutoffDate,
        state: currentState,
        availableActions,
        initiator: {
          __typename: 'MarketParticipant' as const,
          ...initiators[index % initiators.length],
        },
      };
    });

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPointProcessOverview: mockProcesses,
      },
    });
  });
}

function getMeteringPointProcessById(apiBase: string) {
  return mockGetMeteringPointProcessByIdQuery(async (args) => {
    await delay(mswConfig.delay);

    const processId = args.variables.id;
    const reasonCodes = ['MoveIn', 'BalanceFixing', 'WholesaleFixing', 'EndOfSupply'];
    const initiators = [
      { id: '0199ed3d-f1b2-7180-9546-39b5836fb575', displayName: '905495045940594 • Radius' },
      { id: '0199ed3d-f1b2-7180-9546-39b5836fb576', displayName: '5790001330552 • Energinet' },
      { id: '0199ed3d-f1b2-7180-9546-39b5836fb577', displayName: '7080005056076 • Andel' },
      { id: '0199ed3d-f1b2-7180-9546-39b5836fb578', displayName: '5790001687137 • Ørsted' },
    ];

    // Extract index from process ID (e.g., "process-001" -> 1)
    const match = /\d+/.exec(processId);
    const processIndex = match ? Number.parseInt(match[0], 10) : 0;
    const createdAt = new Date('2025-01-01T10:00:00Z');
    createdAt.setDate(createdAt.getDate() + processIndex * 2);

    const cutoffDate = new Date(createdAt);
    cutoffDate.setDate(cutoffDate.getDate() + 3);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPointProcessById: {
          __typename: 'MeteringPointProcess' as const,
          id: processId,
          createdAt,
          cutoffDate,
          state: ProcessState.Succeeded,
          reasonCode: reasonCodes[processIndex % reasonCodes.length],
          initiator: {
            __typename: 'MarketParticipant' as const,
            ...initiators[processIndex % initiators.length],
          },
          steps: [
            {
              __typename: 'MeteringPointProcessStep' as const,
              id: `step-${processId}-1`,
              step: ProcessStepType.Brs_002RequestendofsupplyV1Step_1,
              comment: 'OBS: Sendt til foged',
              completedAt: new Date(createdAt.getTime() + 1000 * 60 * 60 * 24), // 1 day later
              dueDate: new Date(createdAt.getTime() + 1000 * 60 * 60 * 24 * 2), // 2 days later
              state: ProcessState.Succeeded,
              documentUrl: `${apiBase}/v1/MessageArchive/MasterDataDocument?id=38374f50-f00c-4e2a-aec1-70d391cade06`,
              actor: {
                __typename: 'MarketParticipant' as const,
                id: initiators[processIndex % initiators.length].id,
                name: initiators[processIndex % initiators.length].displayName.split(' • ')[1],
              },
            },
            {
              __typename: 'MeteringPointProcessStep' as const,
              id: `step-${processId}-2`,
              step: ProcessStepType.Brs_002RequestendofsupplyV1Step_2,
              comment: 'Afventer bekræftelse',
              completedAt: null,
              dueDate: new Date(createdAt.getTime() + 1000 * 60 * 60 * 24 * 5), // 5 days later
              state: ProcessState.Pending,
              documentUrl: null,
              actor: {
                __typename: 'MarketParticipant' as const,
                id: '0199ed3d-f1b2-7180-9546-39b5836fb576',
                name: 'Energinet',
              },
            },
          ],
        },
      },
    });
  });
}
