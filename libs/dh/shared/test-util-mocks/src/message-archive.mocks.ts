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
  MeteringPointProcessAction,
  MeteringPointProcessState,
  ProcessManagerBusinessReason,
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

type Initiator = { id: string; displayName: string; glnOrEicNumber: string };

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

    const initiators: Initiator[] = [
      {
        id: '0199ed3d-f1b2-7180-9546-39b5836fb575',
        displayName: '905495045940594 • Radius',
        glnOrEicNumber: '905495045940594',
      },
      {
        id: '0199ed3d-f1b2-7180-9546-39b5836fb576',
        displayName: '5790001330552 • Energinet',
        glnOrEicNumber: '5790001330552',
      },
      {
        id: '0199ed3d-f1b2-7180-9546-39b5836fb577',
        displayName: '7080005056076 • Andel',
        glnOrEicNumber: '7080005056076',
      },
      {
        id: '0199ed3d-f1b2-7180-9546-39b5836fb578',
        displayName: '5790001687137 • Ørsted',
        glnOrEicNumber: '5790001687137',
      },
      {
        id: '0199ed3d-f1b2-7180-9546-39b5836fb579',
        displayName: '5706552000028 • Clever Energy',
        glnOrEicNumber: '5706552000028',
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
      availableActions: [
        MeteringPointProcessAction.CancelWorkflow,
        MeteringPointProcessAction.ConfirmWorkflow,
        MeteringPointProcessAction.RejectRequest,
      ],
      initiator: {
        __typename: 'MarketParticipant' as const,
        ...initiators[0],
      },
    };

    const customerMoveInProcess = {
      __typename: 'MeteringPointProcess' as const,
      id: 'process-cmi-info',
      businessReason: ProcessManagerBusinessReason.CustomerMoveIn,
      createdAt: new Date(Date.now() - 6 * 864e5), // 6 days ago (864e5 = 1 day in ms)
      cutoffDate: new Date(Date.now() + 864e5), // tomorrow
      state: MeteringPointProcessState.Pending,
      availableActions: [MeteringPointProcessAction.SendInformation, MeteringPointProcessAction.CancelWorkflow],
      initiator: {
        __typename: 'MarketParticipant' as const,
        id: '0199ed3d-f1b2-7180-9546-39b5836fb576',
        displayName: `${processCmiInfoInitiatorGln} • RSI 01 (Elleverandør)`,
        glnOrEicNumber: processCmiInfoInitiatorGln,
      },
    };

    const customerMoveInIncorrectMoveInProcess = {
      __typename: 'MeteringPointProcess' as const,
      id: 'process-cmi-incorrect-move-in',
      businessReason: ProcessManagerBusinessReason.CustomerMoveIn,
      createdAt: new Date(Date.now() - 3 * 864e5), // 3 days ago
      cutoffDate: new Date(Date.now() + 864e5), // tomorrow
      state: MeteringPointProcessState.Pending,
      availableActions: [MeteringPointProcessAction.InitiateIncorrectMoveIn],
      initiator: {
        __typename: 'MarketParticipant' as const,
        id: '0199ed3d-f1b2-7180-9546-39b5836fb576',
        displayName: `${processCmiInfoInitiatorGln} • RSI 01 (Elleverandør)`,
        glnOrEicNumber: processCmiInfoInitiatorGln,
      },
    };

    const changeOfEnergySupplierProcess = {
      __typename: 'MeteringPointProcess' as const,
      id: 'process-cos-info',
      businessReason: ProcessManagerBusinessReason.ChangeOfEnergySupplier,
      createdAt: new Date(Date.now() - 864e5), // yesterday (864e5 = 1 day in ms)
      cutoffDate: new Date(Date.now() + 864e5), // tomorrow
      state: MeteringPointProcessState.Pending,
      availableActions: [MeteringPointProcessAction.SendInformation, MeteringPointProcessAction.CancelWorkflow],
      initiator: {
        __typename: 'MarketParticipant' as const,
        id: '0199ed3d-f1b2-7180-9546-39b5836fb579',
        displayName: `${processCosInfoInitiatorGln} • NRGi (Elleverandør)`,
        glnOrEicNumber: processCosInfoInitiatorGln,
      },
    };

    const secondaryMoveInProcess = {
      __typename: 'MeteringPointProcess' as const,
      id: 'process-smi-info',
      businessReason: ProcessManagerBusinessReason.SecondaryMoveIn,
      createdAt: new Date('2026-05-15T11:00:00Z'),
      cutoffDate: new Date('2026-05-15T00:00:00Z'),
      state: MeteringPointProcessState.Pending,
      availableActions: [MeteringPointProcessAction.SendInformation],
      initiator: {
        __typename: 'MarketParticipant' as const,
        id: '0199ed3d-f1b2-7180-9546-39b5836fb580',
        displayName: `${processSecondaryMoveInInitiatorGln} • RSI 01 (Elleverandør)`,
        glnOrEicNumber: processSecondaryMoveInInitiatorGln,
      },
    };

    const endOfSupplyRequestServiceProcess = {
      __typename: 'MeteringPointProcess' as const,
      id: 'process-eos-request-service',
      businessReason: ProcessManagerBusinessReason.EndOfSupply,
      createdAt: new Date('2025-02-17T10:00:00Z'),
      cutoffDate: new Date('2025-02-22T10:00:00Z'),
      state: MeteringPointProcessState.Running,
      availableActions: [MeteringPointProcessAction.SendInformation],
      initiator: {
        __typename: 'MarketParticipant' as const,
        ...initiators[2],
      },
    };

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPointProcessOverview: [
          endOfSupplyProcess,
          customerMoveInProcess,
          customerMoveInIncorrectMoveInProcess,
          changeOfEnergySupplierProcess,
          secondaryMoveInProcess,
          endOfSupplyRequestServiceProcess,
          ...mockProcesses,
        ],
      },
    });
  });
}

export const processCmiInfoInitiatorGln = '5790000555588';
export const processCosInfoInitiatorGln = '5790000555588';
export const processSecondaryMoveInInitiatorGln = '5790000555588';

export const knownProcesses: Record<
  string,
  {
    businessReason: ProcessManagerBusinessReason;
    state: MeteringPointProcessState;
    availableActions?: MeteringPointProcessAction[];
    initiatorGln?: string;
  }
> = {
  'process-eos-cancel': {
    businessReason: ProcessManagerBusinessReason.EndOfSupply,
    state: MeteringPointProcessState.Running,
  },
  'process-cmi-info': {
    businessReason: ProcessManagerBusinessReason.CustomerMoveIn,
    state: MeteringPointProcessState.Pending,
    availableActions: [MeteringPointProcessAction.SendInformation, MeteringPointProcessAction.CancelWorkflow],
    initiatorGln: processCmiInfoInitiatorGln,
  },
  'process-cmi-incorrect-move-in': {
    businessReason: ProcessManagerBusinessReason.CustomerMoveIn,
    state: MeteringPointProcessState.Pending,
    availableActions: [MeteringPointProcessAction.InitiateIncorrectMoveIn],
    initiatorGln: processCmiInfoInitiatorGln,
  },
  'process-cos-info': {
    businessReason: ProcessManagerBusinessReason.ChangeOfEnergySupplier,
    state: MeteringPointProcessState.Pending,
    availableActions: [MeteringPointProcessAction.SendInformation, MeteringPointProcessAction.CancelWorkflow],
    initiatorGln: processCosInfoInitiatorGln,
  },
  'process-smi-info': {
    businessReason: ProcessManagerBusinessReason.SecondaryMoveIn,
    state: MeteringPointProcessState.Pending,
    availableActions: [MeteringPointProcessAction.SendInformation],
    initiatorGln: processSecondaryMoveInInitiatorGln,
  },
  'process-eos-request-service': {
    businessReason: ProcessManagerBusinessReason.EndOfSupply,
    state: MeteringPointProcessState.Running,
    availableActions: [MeteringPointProcessAction.SendInformation],
  },
};

function getAvailableActions(
  businessReason: ProcessManagerBusinessReason,
  state: MeteringPointProcessState
): MeteringPointProcessAction[] {
  const terminalStates: MeteringPointProcessState[] = [
    MeteringPointProcessState.Failed,
    MeteringPointProcessState.Canceled,
    MeteringPointProcessState.Succeeded,
    MeteringPointProcessState.Rejected,
  ];
  if (terminalStates.includes(state)) return [];
  if (businessReason === ProcessManagerBusinessReason.EndOfSupply)
    return [
      MeteringPointProcessAction.CancelWorkflow,
      MeteringPointProcessAction.ConfirmWorkflow,
      MeteringPointProcessAction.RejectRequest,
    ];
  if (businessReason === ProcessManagerBusinessReason.CustomerMoveIn)
    return [MeteringPointProcessAction.SendInformation, MeteringPointProcessAction.CancelWorkflow];
  if (businessReason === ProcessManagerBusinessReason.SecondaryMoveIn)
    return [MeteringPointProcessAction.SendInformation];
  if (businessReason === ProcessManagerBusinessReason.ChangeOfEnergySupplier)
    return [MeteringPointProcessAction.SendInformation, MeteringPointProcessAction.CancelWorkflow];
  return [];
}

function buildCustomerMoveInProcess(processId: string, apiBase: string, initiatorId: string) {
  const createdAt = new Date(Date.now() - 6 * 864e5); // 6 days ago (864e5 = 1 day in ms)
  const actor = {
    __typename: 'MarketParticipant' as const,
    id: initiatorId,
    displayName: `${processCmiInfoInitiatorGln} • RSI 01 (Elleverandør)`,
  };

  const step = ({
    stepId,
    stepKey,
    completedAt = null,
    stepState = MeteringPointProcessState.Pending,
    documentUrl = null,
    actorValue = null,
  }: {
    stepId: string;
    stepKey: string;
    completedAt?: Date | null;
    stepState?: MeteringPointProcessState;
    documentUrl?: string | null;
    actorValue?: typeof actor | null;
  }) => ({
    __typename: 'MeteringPointProcessStep' as const,
    id: `step-${processId}-${stepId}`,
    step: stepKey,
    comment: null,
    completedAt,
    dueDate: null,
    state: stepState,
    description: '',
    documentUrl,
    actor: actorValue,
  });

  return {
    __typename: 'MeteringPointProcess' as const,
    id: processId,
    createdAt,
    cutoffDate: new Date(Date.now() + 864e5), // tomorrow (864e5 = 1 day in ms)
    businessReason: ProcessManagerBusinessReason.CustomerMoveIn,
    state: MeteringPointProcessState.Pending,
    availableActions: [MeteringPointProcessAction.SendInformation, MeteringPointProcessAction.CancelWorkflow],
    initiator: {
      __typename: 'MarketParticipant' as const,
      id: initiatorId,
      glnOrEicNumber: processCmiInfoInitiatorGln,
      displayName: `${processCmiInfoInitiatorGln} • RSI 01 (Elleverandør)`,
    },
    steps: [
      step({ stepId: '1', stepKey: 'BRS_009_MOVEIN_V1_STEP_1', actorValue: actor }),
      step({ stepId: '2', stepKey: 'BRS_009_MOVEIN_V1_STEP_2', actorValue: actor }),
      step({ stepId: '4', stepKey: 'BRS_009_MOVEIN_V1_STEP_4', actorValue: actor }),
      step({ stepId: '5', stepKey: 'BRS_009_MOVEIN_V1_STEP_5', actorValue: actor }),
      step({ stepId: '6', stepKey: 'BRS_009_MOVEIN_V1_STEP_6', actorValue: actor }),
      step({ stepId: '7', stepKey: 'BRS_009_MOVEIN_V1_STEP_7' }),
      step({ stepId: '10', stepKey: 'BRS_009_MOVEIN_V1_STEP_10' }),
      step({ stepId: '12', stepKey: 'BRS_009_MOVEIN_V1_STEP_12' }),
    ],
  };
}

function buildChangeOfEnergySupplierProcess(
  processId: string,
  apiBase: string,
  initiatorId: string
) {
  const createdAt = new Date(Date.now() - 864e5); // yesterday (864e5 = 1 day in ms)
  const stepsCompletedAt = new Date(Date.now() - 864e5); // yesterday
  const lastStepCompletedAt = new Date(Date.now() - 864e5); // yesterday
  const actor = {
    __typename: 'MarketParticipant' as const,
    id: initiatorId,
    displayName: `${processCosInfoInitiatorGln} • NRGi (Elleverandør)`,
  };

  const step = ({
    stepId,
    stepKey,
    completedAt = null,
    stepState = MeteringPointProcessState.Pending,
    documentUrl = null,
    actorValue = null,
  }: {
    stepId: string;
    stepKey: string;
    completedAt?: Date | null;
    stepState?: MeteringPointProcessState;
    documentUrl?: string | null;
    actorValue?: typeof actor | null;
  }) => ({
    __typename: 'MeteringPointProcessStep' as const,
    id: `step-${processId}-${stepId}`,
    step: stepKey,
    comment: null,
    completedAt,
    dueDate: null,
    state: stepState,
    description: '',
    documentUrl,
    actor: actorValue,
  });

  return {
    __typename: 'MeteringPointProcess' as const,
    id: processId,
    createdAt,
    cutoffDate: new Date(Date.now() + 864e5), // tomorrow (864e5 = 1 day in ms)
    businessReason: ProcessManagerBusinessReason.ChangeOfEnergySupplier,
    state: MeteringPointProcessState.Pending,
    availableActions: [MeteringPointProcessAction.SendInformation, MeteringPointProcessAction.CancelWorkflow],
    initiator: {
      __typename: 'MarketParticipant' as const,
      id: initiatorId,
      glnOrEicNumber: processCosInfoInitiatorGln,
      displayName: `${processCosInfoInitiatorGln} • NRGi (Elleverandør)`,
    },
    steps: [
      step({
        stepId: '1',
        stepKey: 'BRS_001_CHANGEOFENERGYSUPPLIER_V1_STEP_1',
        completedAt: stepsCompletedAt,
        stepState: MeteringPointProcessState.Succeeded,
        actorValue: actor,
        documentUrl: `${apiBase}/v1/MessageArchive/MasterDataDocument?id=cos-step-1`,
      }),
      step({
        stepId: '2',
        stepKey: 'BRS_001_CHANGEOFENERGYSUPPLIER_V1_STEP_2',
        completedAt: stepsCompletedAt,
        stepState: MeteringPointProcessState.Succeeded,
        actorValue: actor,
        documentUrl: `${apiBase}/v1/MessageArchive/MasterDataDocument?id=cos-step-2`,
      }),
      step({
        stepId: '4',
        stepKey: 'BRS_001_CHANGEOFENERGYSUPPLIER_V1_STEP_4',
        completedAt: stepsCompletedAt,
        stepState: MeteringPointProcessState.Succeeded,
        actorValue: actor,
        documentUrl: `${apiBase}/v1/MessageArchive/MasterDataDocument?id=cos-step-4`,
      }),
      step({
        stepId: '5',
        stepKey: 'BRS_001_CHANGEOFENERGYSUPPLIER_V1_STEP_5',
        completedAt: stepsCompletedAt,
        stepState: MeteringPointProcessState.Succeeded,
        actorValue: actor,
        documentUrl: `${apiBase}/v1/MessageArchive/MasterDataDocument?id=cos-step-5`,
      }),
      step({
        stepId: '6',
        stepKey: 'BRS_001_CHANGEOFENERGYSUPPLIER_V1_STEP_6',
        completedAt: stepsCompletedAt,
        stepState: MeteringPointProcessState.Succeeded,
        actorValue: actor,
        documentUrl: `${apiBase}/v1/MessageArchive/MasterDataDocument?id=cos-step-6`,
      }),
      step({
        stepId: '7',
        stepKey: 'BRS_001_REQUESTCHANGECUSTOMERCHARACTERISTICS_V1_STEP_7',
        completedAt: lastStepCompletedAt,
        stepState: MeteringPointProcessState.Succeeded,
        actorValue: actor,
        documentUrl: `${apiBase}/v1/MessageArchive/MasterDataDocument?id=cos-step-7`,
      }),
      step({ stepId: '11', stepKey: 'BRS_001_CHANGEOFENERGYSUPPLIER_V1_STEP_11' }),
      step({ stepId: '12', stepKey: 'BRS_001_CHANGEOFENERGYSUPPLIER_V1_STEP_12' }),
    ],
  };
}

function buildSecondaryMoveInProcess(processId: string, apiBase: string, initiatorId: string) {
  const createdAt = new Date('2026-05-15T11:00:00Z');
  const actor = {
    __typename: 'MarketParticipant' as const,
    id: initiatorId,
    displayName: `${processSecondaryMoveInInitiatorGln} • RSI 01 (Elleverandør)`,
  };

  const step = ({
    stepId,
    stepKey,
    completedAt = null,
    stepState = MeteringPointProcessState.Pending,
    documentUrl = null,
    actorValue = null,
  }: {
    stepId: string;
    stepKey: string;
    completedAt?: Date | null;
    stepState?: MeteringPointProcessState;
    documentUrl?: string | null;
    actorValue?: typeof actor | null;
  }) => ({
    __typename: 'MeteringPointProcessStep' as const,
    id: `step-${processId}-${stepId}`,
    step: stepKey,
    comment: null,
    completedAt,
    dueDate: null,
    state: stepState,
    description: '',
    documentUrl,
    actor: actorValue,
  });

  return {
    __typename: 'MeteringPointProcess' as const,
    id: processId,
    createdAt,
    cutoffDate: new Date('2026-05-15T00:00:00Z'),
    businessReason: ProcessManagerBusinessReason.SecondaryMoveIn,
    state: MeteringPointProcessState.Pending,
    availableActions: [MeteringPointProcessAction.SendInformation],
    initiator: {
      __typename: 'MarketParticipant' as const,
      id: initiatorId,
      glnOrEicNumber: processSecondaryMoveInInitiatorGln,
      displayName: `${processSecondaryMoveInInitiatorGln} • RSI 01 (Elleverandør)`,
    },
    steps: [
      step({ stepId: '1', stepKey: 'BRS_009_SECONDARYMOVEIN_V1_STEP_1', actorValue: actor }),
      step({ stepId: '2', stepKey: 'BRS_009_SECONDARYMOVEIN_V1_STEP_2', actorValue: actor }),
      step({ stepId: '4', stepKey: 'BRS_009_SECONDARYMOVEIN_V1_STEP_4', actorValue: actor }),
      step({ stepId: '5', stepKey: 'BRS_009_SECONDARYMOVEIN_V1_STEP_5', actorValue: actor }),
      step({ stepId: '6', stepKey: 'BRS_009_SECONDARYMOVEIN_V1_STEP_6', actorValue: actor }),
      step({ stepId: '7', stepKey: 'BRS_009_SECONDARYMOVEIN_V1_STEP_7' }),
      step({ stepId: '10', stepKey: 'BRS_009_SECONDARYMOVEIN_V1_STEP_10' }),
      step({ stepId: '12', stepKey: 'BRS_009_SECONDARYMOVEIN_V1_STEP_12' }),
    ],
  };
}

function buildGenericProcess({
  processId,
  apiBase,
  processIndex,
  initiators,
  createdAt,
  cutoffDate,
  businessReason,
  state,
  availableActions,
  initiator,
}: {
  processId: string;
  apiBase: string;
  processIndex: number;
  initiators: Initiator[];
  createdAt: Date;
  cutoffDate: Date;
  businessReason: ProcessManagerBusinessReason;
  state: MeteringPointProcessState;
  availableActions: MeteringPointProcessAction[];
  initiator: Initiator;
}) {
  return {
    __typename: 'MeteringPointProcess' as const,
    id: processId,
    createdAt,
    cutoffDate,
    businessReason,
    state,
    availableActions,
    initiator: {
      __typename: 'MarketParticipant' as const,
      ...initiator,
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
  };
}

function getMeteringPointProcessById(apiBase: string) {
  return mockGetMeteringPointProcessByIdQuery(async (args) => {
    await delay(mswConfig.delay);

    const processId = args.variables.id;

    // Note: the GLN for the first initiator (…fb575, Radius) intentionally differs from the
    // overview mock (905495045940594) so that dev mode can demonstrate the InitiatingParticipant
    // path against a test actor's default GLN. This is a dev-only override — not a data error.
    const initiators: Initiator[] = [
      {
        id: '0199ed3d-f1b2-7180-9546-39b5836fb575',
        displayName: '1234567890123 • Radius',
        glnOrEicNumber: '1234567890123',
      },
      {
        id: '0199ed3d-f1b2-7180-9546-39b5836fb576',
        displayName: '5790001330552 • Energinet',
        glnOrEicNumber: '5790001330552',
      },
      {
        id: '0199ed3d-f1b2-7180-9546-39b5836fb577',
        displayName: '7080005056076 • Andel',
        glnOrEicNumber: '7080005056076',
      },
      {
        id: '0199ed3d-f1b2-7180-9546-39b5836fb578',
        displayName: '5790001687137 • Ørsted',
        glnOrEicNumber: '5790001687137',
      },
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
    const availableActions = known?.availableActions ?? getAvailableActions(businessReason, state);

    const baseInitiator = initiators[processIndex % initiators.length];
    const initiator = known?.initiatorGln
      ? {
          ...baseInitiator,
          glnOrEicNumber: known.initiatorGln,
          displayName: `${known.initiatorGln} • Test`,
        }
      : baseInitiator;

    const meteringPointProcessById =
      processId === 'process-cmi-info'
        ? buildCustomerMoveInProcess(processId, apiBase, initiator.id)
        : processId === 'process-cos-info'
          ? buildChangeOfEnergySupplierProcess(processId, apiBase, initiator.id)
          : processId === 'process-smi-info'
            ? buildSecondaryMoveInProcess(processId, apiBase, initiator.id)
            : buildGenericProcess({
                processId,
                apiBase,
                processIndex,
                initiators,
                createdAt,
                cutoffDate,
                businessReason,
                state,
                availableActions,
                initiator,
              });

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPointProcessById,
      },
    });
  });
}
