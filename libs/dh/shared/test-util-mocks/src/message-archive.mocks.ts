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

import { mswConfig } from '@energinet-datahub/gf/msw/test-util-msw-setup';
import {
  DocumentType,
  MeteringPointProcessState,
  ProcessManagerBusinessReason,
  WorkflowAction,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { da } from '@energinet-datahub/dh/globalization/assets-localization';
import {
  mockGetArchivedMessagesQuery,
  mockGetArchivedMessagesForMeteringPointQuery,
  mockGetMeteringPointProcessOverviewQuery,
  mockGetMeteringPointProcessByIdQuery,
} from '@energinet-datahub/dh/shared/domain/graphql/msw';

import { messageArchiveSearchResponseLogs } from './data/message-archive-search-response-logs';
import { document, documentJson } from './data/message-archived-document';

// Derive valid business reasons from translation keys — stays in sync automatically
const translatedBusinessReasons = Object.keys(
  da.meteringPoint.processOverview.processType
) as ProcessManagerBusinessReason[];

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

    const states = [
      MeteringPointProcessState.Pending,
      MeteringPointProcessState.Running,
      MeteringPointProcessState.Succeeded,
      MeteringPointProcessState.Failed,
      MeteringPointProcessState.Canceled,
      MeteringPointProcessState.Rejected,
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

    const baseDate = new Date('2025-01-01T10:00:00Z');

    const mockProcesses = Array.from(
      { length: translatedBusinessReasons.length * 3 },
      (_, index) => {
        const daysOffset = Math.floor(index * 2);
        const hoursOffset = (index * 3) % 24;
        const createdAt = new Date(baseDate);
        createdAt.setDate(createdAt.getDate() + daysOffset);
        createdAt.setHours(createdAt.getHours() + hoursOffset);

        const currentState = states[index % states.length];
        const businessReason = translatedBusinessReasons[index % translatedBusinessReasons.length];
        const availableActions = getAvailableActions(businessReason, currentState);

        let cutoffDate = null;
        if (currentState !== MeteringPointProcessState.Pending) {
          cutoffDate = new Date(createdAt);
          cutoffDate.setDate(cutoffDate.getDate() + ((index % 5) + 1));
        }

        return {
          __typename: 'MeteringPointProcess' as const,
          id: `process-${String(index + 1).padStart(3, '0')}`,
          businessReason,
          createdAt,
          cutoffDate,
          state: currentState,
          availableActions,
          initiator: {
            __typename: 'MarketParticipant' as const,
            ...initiators[index % initiators.length],
          },
        };
      }
    );

    // Explicit processes with actions for testing
    const endOfSupplyProcess = {
      __typename: 'MeteringPointProcess' as const,
      id: 'process-eos-cancel',
      businessReason: ProcessManagerBusinessReason.EndOfSupply,
      createdAt: new Date('2025-02-15T10:00:00Z'),
      cutoffDate: new Date('2025-02-20T10:00:00Z'),
      state: MeteringPointProcessState.Running,
      availableActions: [WorkflowAction.CancelWorkflow, WorkflowAction.RejectRequest],
      initiator: {
        __typename: 'MarketParticipant' as const,
        ...initiators[0],
      },
    };

    const customerMoveInProcess = {
      __typename: 'MeteringPointProcess' as const,
      id: 'process-cmi-info',
      businessReason: ProcessManagerBusinessReason.CustomerMoveIn,
      createdAt: new Date('2025-02-16T10:00:00Z'),
      cutoffDate: new Date('2025-02-21T10:00:00Z'),
      state: MeteringPointProcessState.Running,
      availableActions: [WorkflowAction.SendInformation],
      initiator: {
        __typename: 'MarketParticipant' as const,
        ...initiators[1],
      },
    };

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPointProcessOverview: [endOfSupplyProcess, customerMoveInProcess, ...mockProcesses],
      },
    });
  });
}

const knownProcesses: Record<
  string,
  { businessReason: ProcessManagerBusinessReason; state: MeteringPointProcessState }
> = {
  'process-eos-cancel': {
    businessReason: ProcessManagerBusinessReason.EndOfSupply,
    state: MeteringPointProcessState.Running,
  },
  'process-cmi-info': {
    businessReason: ProcessManagerBusinessReason.CustomerMoveIn,
    state: MeteringPointProcessState.Running,
  },
};

function getAvailableActions(
  businessReason: ProcessManagerBusinessReason,
  state: MeteringPointProcessState
): WorkflowAction[] {
  const terminalStates: MeteringPointProcessState[] = [
    MeteringPointProcessState.Failed,
    MeteringPointProcessState.Canceled,
    MeteringPointProcessState.Succeeded,
    MeteringPointProcessState.Rejected,
  ];
  if (terminalStates.includes(state)) return [];
  if (businessReason === ProcessManagerBusinessReason.EndOfSupply)
    return [WorkflowAction.CancelWorkflow, WorkflowAction.RejectRequest];
  if (businessReason === ProcessManagerBusinessReason.CustomerMoveIn)
    return [WorkflowAction.SendInformation];
  return [];
}

function getMeteringPointProcessById(apiBase: string) {
  return mockGetMeteringPointProcessByIdQuery(async (args) => {
    await delay(mswConfig.delay);

    const processId = args.variables.id;

    const initiators = [
      { id: '0199ed3d-f1b2-7180-9546-39b5836fb575', displayName: '905495045940594 • Radius' },
      { id: '0199ed3d-f1b2-7180-9546-39b5836fb576', displayName: '5790001330552 • Energinet' },
      { id: '0199ed3d-f1b2-7180-9546-39b5836fb577', displayName: '7080005056076 • Andel' },
      { id: '0199ed3d-f1b2-7180-9546-39b5836fb578', displayName: '5790001687137 • Ørsted' },
    ];

    // Extract index from process ID (e.g., "process-001" -> 1)
    const numericMatch = processId.match(/\d+/);
    const processIndex = numericMatch ? Number.parseInt(numericMatch[0], 10) : 0;
    const createdAt = new Date('2025-01-01T10:00:00Z');
    createdAt.setDate(createdAt.getDate() + processIndex * 2);

    const cutoffDate = new Date(createdAt);
    cutoffDate.setDate(cutoffDate.getDate() + 3);

    const allStates = [
      MeteringPointProcessState.Pending,
      MeteringPointProcessState.Running,
      MeteringPointProcessState.Succeeded,
      MeteringPointProcessState.Failed,
      MeteringPointProcessState.Canceled,
      MeteringPointProcessState.Rejected,
    ];

    // Derive businessReason and state consistently with overview mock
    const known = knownProcesses[processId];
    const safeIndex = Math.max(processIndex, 1) - 1;
    const businessReason =
      known?.businessReason ??
      translatedBusinessReasons[safeIndex % translatedBusinessReasons.length];
    const state = known?.state ?? allStates[safeIndex % allStates.length];
    const availableActions = getAvailableActions(businessReason, state);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPointProcessById: {
          __typename: 'MeteringPointProcess' as const,
          id: processId,
          createdAt,
          cutoffDate,
          businessReason,
          state,
          availableActions,
          initiator: {
            __typename: 'MarketParticipant' as const,
            ...initiators[processIndex % initiators.length],
          },
          steps: [
            {
              __typename: 'MeteringPointProcessStep' as const,
              id: `step-${processId}-1`,
              step: 'BRS_002_REQUESTENDOFSUPPLY_V1_STEP_1',
              comment: 'OBS: Sendt til foged',
              completedAt: new Date(createdAt.getTime() + 1000 * 60 * 60 * 24),
              dueDate: new Date(createdAt.getTime() + 1000 * 60 * 60 * 24 * 2),
              state: MeteringPointProcessState.Succeeded,
              description:
                'Første step i processen, hvor vi har sendt en anmodning om end of supply til den relevante aktør.',
              documentUrl: `${apiBase}/v1/MessageArchive/MasterDataDocument?id=38374f50-f00c-4e2a-aec1-70d391cade06`,
              actor: {
                __typename: 'MarketParticipant' as const,
                id: initiators[processIndex % initiators.length].id,
                displayName: initiators[processIndex % initiators.length].displayName,
              },
            },
            {
              __typename: 'MeteringPointProcessStep' as const,
              id: `step-${processId}-2`,
              step: 'BRS_002_REQUESTENDOFSUPPLY_V1_STEP_2',
              comment: 'Afventer bekræftelse',
              completedAt: null,
              dueDate: new Date(createdAt.getTime() + 1000 * 60 * 60 * 24 * 5),
              state: MeteringPointProcessState.Pending,
              description:
                'Andet step i processen, hvor vi afventer en bekræftelse fra den relevante aktør om modtagelsen af anmodningen.',
              documentUrl: null,
              actor: {
                __typename: 'MarketParticipant' as const,
                id: '0199ed3d-f1b2-7180-9546-39b5836fb576',
                displayName: '5790001330552 • Energinet',
              },
            },
          ],
        },
      },
    });
  });
}
