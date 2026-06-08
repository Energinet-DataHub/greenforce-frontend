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
  EicFunction,
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

type Initiator = {
  id: string;
  displayName: string;
  glnOrEicNumber: string;
  role: EicFunction;
};

// Splits an `Initiator` fixture into the `initiator` (MarketParticipant) object and
// the process-level `initiatorRole`, mirroring the real BFF shape where the role is
// always populated but the resolved participant may be null (masked) for foreign actors.
function initiatorFields(initiator: Initiator) {
  const { role, ...participant } = initiator;
  return {
    initiator: { __typename: 'MarketParticipant' as const, ...participant },
    initiatorRole: role,
  };
}

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

// Single source of truth for the overview rows (memoized, built once). The by-id handler reads
// each process's shared fields from here so list and drawer agree (Apollo normalizes by id, so
// a mismatch makes the list row change when its drawer opens).
let overviewProcessesCache: ReturnType<typeof buildOverviewProcesses> | undefined;
function getOverviewProcesses() {
  return (overviewProcessesCache ??= buildOverviewProcesses());
}

function getMeteringPointProcessOverview() {
  return mockGetMeteringPointProcessOverviewQuery(async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json({
      data: { __typename: 'Query', meteringPointProcessOverview: getOverviewProcesses() },
    });
  });
}

function buildOverviewProcesses() {
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
      role: EicFunction.GridAccessProvider,
    },
    {
      id: '0199ed3d-f1b2-7180-9546-39b5836fb576',
      displayName: '5790001330552 • Energinet',
      glnOrEicNumber: '5790001330552',
      role: EicFunction.SystemOperator,
    },
    {
      id: '0199ed3d-f1b2-7180-9546-39b5836fb577',
      displayName: '7080005056076 • Andel',
      glnOrEicNumber: '7080005056076',
      role: EicFunction.EnergySupplier,
    },
    {
      id: '0199ed3d-f1b2-7180-9546-39b5836fb578',
      displayName: '5790001687137 • Ørsted',
      glnOrEicNumber: '5790001687137',
      role: EicFunction.EnergySupplier,
    },
    {
      id: '0199ed3d-f1b2-7180-9546-39b5836fb579',
      displayName: '5706552000028 • Clever Energy',
      glnOrEicNumber: '5706552000028',
      role: EicFunction.EnergySupplier,
    },
  ];

  const baseDate = new Date('2025-01-01T10:00:00Z');

  const mockProcesses = Array.from({ length: translatedBusinessReasons.length * 3 }, (_, index) => {
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
      ...initiatorFields(initiators[index % initiators.length]),
    };
  });

  // Explicit processes with actions for testing
  const endOfSupplyProcess = {
    __typename: 'MeteringPointProcess' as const,
    id: 'process-eos-cancel',
    businessReason: ProcessManagerBusinessReason.EndOfSupply,
    createdAt: new Date('2025-02-15T10:00:00Z'),
    cutoffDate: new Date('2025-02-20T10:00:00Z'),
    state: MeteringPointProcessState.Running,
    availableActions: [
      WorkflowAction.CancelWorkflow,
      WorkflowAction.ConfirmWorkflow,
      WorkflowAction.RejectRequest,
    ],
    ...initiatorFields(initiators[0]),
  };

  const customerMoveInProcess = {
    __typename: 'MeteringPointProcess' as const,
    id: 'process-cmi-info',
    businessReason: ProcessManagerBusinessReason.CustomerMoveIn,
    createdAt: new Date(Date.now() - 6 * 864e5), // 6 days ago (864e5 = 1 day in ms)
    cutoffDate: new Date(Date.now() + 864e5), // tomorrow
    state: MeteringPointProcessState.Pending,
    // BRS-009 only surfaces the "request correction" action (a separate button)
    availableActions: [],
    initiator: {
      __typename: 'MarketParticipant' as const,
      id: '0199ed3d-f1b2-7180-9546-39b5836fb576',
      displayName: `${processCmiInfoInitiatorGln} • RSI 01 (Elleverandør)`,
      glnOrEicNumber: processCmiInfoInitiatorGln,
    },
    initiatorRole: EicFunction.EnergySupplier,
  };

  const changeOfEnergySupplierProcess = {
    __typename: 'MeteringPointProcess' as const,
    id: 'process-cos-info',
    businessReason: ProcessManagerBusinessReason.ChangeOfEnergySupplier,
    createdAt: new Date(Date.now() - 864e5), // yesterday (864e5 = 1 day in ms)
    cutoffDate: new Date(Date.now() + 864e5), // tomorrow
    state: MeteringPointProcessState.Pending,
    availableActions: [WorkflowAction.SendInformation, WorkflowAction.CancelWorkflow],
    initiator: {
      __typename: 'MarketParticipant' as const,
      id: '0199ed3d-f1b2-7180-9546-39b5836fb579',
      displayName: `${processCosInfoInitiatorGln} • NRGi (Elleverandør)`,
      glnOrEicNumber: processCosInfoInitiatorGln,
    },
    initiatorRole: EicFunction.EnergySupplier,
  };

  const secondaryMoveInProcess = {
    __typename: 'MeteringPointProcess' as const,
    id: 'process-smi-info',
    businessReason: ProcessManagerBusinessReason.SecondaryMoveIn,
    createdAt: new Date('2026-05-15T11:00:00Z'),
    cutoffDate: new Date('2026-05-15T00:00:00Z'),
    state: MeteringPointProcessState.Pending,
    availableActions: [WorkflowAction.SendInformation],
    initiator: {
      __typename: 'MarketParticipant' as const,
      id: '0199ed3d-f1b2-7180-9546-39b5836fb580',
      displayName: `${processSecondaryMoveInInitiatorGln} • RSI 01 (Elleverandør)`,
      glnOrEicNumber: processSecondaryMoveInInitiatorGln,
    },
    initiatorRole: EicFunction.EnergySupplier,
  };

  const endOfSupplyRequestServiceProcess = {
    __typename: 'MeteringPointProcess' as const,
    id: 'process-eos-request-service',
    businessReason: ProcessManagerBusinessReason.EndOfSupply,
    createdAt: new Date('2025-02-17T10:00:00Z'),
    cutoffDate: new Date('2025-02-22T10:00:00Z'),
    state: MeteringPointProcessState.Running,
    availableActions: [WorkflowAction.SendInformation],
    ...initiatorFields(initiators[2]),
  };

  // Masked initiator: the resolved participant is null, so the initiator column
  // falls back to the translated role (GridAccessProvider -> "Grid access provider").
  const maskedInitiatorProcess = {
    __typename: 'MeteringPointProcess' as const,
    id: 'process-masked-initiator',
    businessReason: ProcessManagerBusinessReason.EndOfSupply,
    createdAt: new Date('2025-03-01T10:00:00Z'),
    cutoffDate: new Date('2025-03-05T10:00:00Z'),
    state: MeteringPointProcessState.Running,
    availableActions: [],
    initiator: null,
    initiatorRole: EicFunction.GridAccessProvider,
  };

  // The process that cross-cancelled `process-cross-cancelled`. Being present in
  // the overview list is what makes the cancellation banner render a link to it.
  const cancellingProcess = {
    __typename: 'MeteringPointProcess' as const,
    id: 'process-cancelling',
    businessReason: ProcessManagerBusinessReason.SecondaryMoveIn,
    createdAt: new Date('2026-02-15T10:00:00Z'),
    cutoffDate: new Date('2026-02-17T00:00:00Z'),
    state: MeteringPointProcessState.Running,
    availableActions: [WorkflowAction.SendInformation],
    ...initiatorFields(initiators[0]),
  };

  // The cancelled process: in the list so its drawer (and the cross-cancellation banner
  // linking to `cancellingProcess` above) is reachable by clicking a row.
  const crossCancelledProcess = {
    __typename: 'MeteringPointProcess' as const,
    id: 'process-cross-cancelled',
    businessReason: ProcessManagerBusinessReason.CustomerMoveIn,
    createdAt: new Date('2026-02-14T10:00:00Z'),
    cutoffDate: new Date('2026-02-17T00:00:00Z'),
    state: MeteringPointProcessState.Canceled,
    availableActions: [],
    ...initiatorFields(initiators[1]),
  };

  return [
    endOfSupplyProcess,
    customerMoveInProcess,
    changeOfEnergySupplierProcess,
    secondaryMoveInProcess,
    endOfSupplyRequestServiceProcess,
    maskedInitiatorProcess,
    crossCancelledProcess,
    cancellingProcess,
    ...mockProcesses,
  ];
}

export const processCmiInfoInitiatorGln = '5790000555588';
export const processCosInfoInitiatorGln = '5790000555588';
export const processSecondaryMoveInInitiatorGln = '5790000555588';

export const knownProcesses: Record<
  string,
  {
    businessReason: ProcessManagerBusinessReason;
    state: MeteringPointProcessState;
    availableActions?: WorkflowAction[];
    initiatorGln?: string;
    // Masks the initiator (resolved participant is null), keeping only the role,
    // mirroring a foreign actor whose GLN the logged-in user may not see.
    maskInitiator?: boolean;
    initiatorRole?: EicFunction;
    cancelledByProcess?: {
      id: string;
      businessReason: ProcessManagerBusinessReason;
      cutoffDate: Date;
    };
  }
> = {
  'process-eos-cancel': {
    businessReason: ProcessManagerBusinessReason.EndOfSupply,
    state: MeteringPointProcessState.Running,
  },
  // Cross-cancelled by a process whose id is present in the overview list
  // (`process-cancelling`) -> the banner links to it.
  'process-cross-cancelled': {
    businessReason: ProcessManagerBusinessReason.CustomerMoveIn,
    state: MeteringPointProcessState.Canceled,
    availableActions: [],
    cancelledByProcess: {
      id: 'process-cancelling',
      businessReason: ProcessManagerBusinessReason.SecondaryMoveIn,
      cutoffDate: new Date('2026-02-17T00:00:00Z'),
    },
  },
  // Cross-cancelled by a process whose id is absent from the overview list
  // (`process-cancelling-not-listed`) -> the banner shows plain text.
  'process-cross-cancelled-not-listed': {
    businessReason: ProcessManagerBusinessReason.CustomerMoveIn,
    state: MeteringPointProcessState.Canceled,
    availableActions: [],
    cancelledByProcess: {
      id: 'process-cancelling-not-listed',
      businessReason: ProcessManagerBusinessReason.SecondaryMoveIn,
      cutoffDate: new Date('2026-02-17T00:00:00Z'),
    },
  },
  'process-cmi-info': {
    businessReason: ProcessManagerBusinessReason.CustomerMoveIn,
    state: MeteringPointProcessState.Pending,
    availableActions: [WorkflowAction.SendInformation, WorkflowAction.CancelWorkflow],
    initiatorGln: processCmiInfoInitiatorGln,
  },
  'process-cos-info': {
    businessReason: ProcessManagerBusinessReason.ChangeOfEnergySupplier,
    state: MeteringPointProcessState.Pending,
    availableActions: [WorkflowAction.SendInformation, WorkflowAction.CancelWorkflow],
    initiatorGln: processCosInfoInitiatorGln,
  },
  'process-smi-info': {
    businessReason: ProcessManagerBusinessReason.SecondaryMoveIn,
    state: MeteringPointProcessState.Pending,
    availableActions: [WorkflowAction.SendInformation],
    initiatorGln: processSecondaryMoveInInitiatorGln,
  },
  'process-eos-request-service': {
    businessReason: ProcessManagerBusinessReason.EndOfSupply,
    state: MeteringPointProcessState.Running,
    availableActions: [WorkflowAction.SendInformation],
  },
  // Masked initiator: the resolved participant is null, so the drawer falls back to
  // the translated initiator role (GridAccessProvider -> "Netvirksomhed").
  'process-masked-initiator': {
    businessReason: ProcessManagerBusinessReason.EndOfSupply,
    state: MeteringPointProcessState.Running,
    availableActions: [],
    maskInitiator: true,
    initiatorRole: EicFunction.GridAccessProvider,
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
    return [
      WorkflowAction.CancelWorkflow,
      WorkflowAction.ConfirmWorkflow,
      WorkflowAction.RejectRequest,
    ];
  if (businessReason === ProcessManagerBusinessReason.CustomerMoveIn)
    return [WorkflowAction.SendInformation, WorkflowAction.CancelWorkflow];
  if (businessReason === ProcessManagerBusinessReason.SecondaryMoveIn)
    return [WorkflowAction.SendInformation];
  if (businessReason === ProcessManagerBusinessReason.ChangeOfEnergySupplier)
    return [WorkflowAction.SendInformation, WorkflowAction.CancelWorkflow];
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
    // Mirrors the BFF: the role is always populated when there is an actor on the
    // step; future/unassigned steps have no actor and therefore no role.
    actorRole: actorValue ? EicFunction.EnergySupplier : null,
  });

  return {
    __typename: 'MeteringPointProcess' as const,
    id: processId,
    createdAt,
    cutoffDate: new Date(Date.now() + 864e5), // tomorrow (864e5 = 1 day in ms)
    businessReason: ProcessManagerBusinessReason.CustomerMoveIn,
    state: MeteringPointProcessState.Pending,
    availableActions: [WorkflowAction.SendInformation, WorkflowAction.CancelWorkflow],
    initiator: {
      __typename: 'MarketParticipant' as const,
      id: initiatorId,
      glnOrEicNumber: processCmiInfoInitiatorGln,
      displayName: `${processCmiInfoInitiatorGln} • RSI 01 (Elleverandør)`,
    },
    initiatorRole: EicFunction.EnergySupplier,
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
    // Mirrors the BFF: the role is always populated when there is an actor on the
    // step; future/unassigned steps have no actor and therefore no role.
    actorRole: actorValue ? EicFunction.EnergySupplier : null,
  });

  return {
    __typename: 'MeteringPointProcess' as const,
    id: processId,
    createdAt,
    cutoffDate: new Date(Date.now() + 864e5), // tomorrow (864e5 = 1 day in ms)
    businessReason: ProcessManagerBusinessReason.ChangeOfEnergySupplier,
    state: MeteringPointProcessState.Pending,
    availableActions: [WorkflowAction.SendInformation, WorkflowAction.CancelWorkflow],
    initiator: {
      __typename: 'MarketParticipant' as const,
      id: initiatorId,
      glnOrEicNumber: processCosInfoInitiatorGln,
      displayName: `${processCosInfoInitiatorGln} • NRGi (Elleverandør)`,
    },
    initiatorRole: EicFunction.EnergySupplier,
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
    // Mirrors the BFF: the role is always populated when there is an actor on the
    // step; future/unassigned steps have no actor and therefore no role.
    actorRole: actorValue ? EicFunction.EnergySupplier : null,
  });

  return {
    __typename: 'MeteringPointProcess' as const,
    id: processId,
    createdAt,
    cutoffDate: new Date('2026-05-15T00:00:00Z'),
    businessReason: ProcessManagerBusinessReason.SecondaryMoveIn,
    state: MeteringPointProcessState.Pending,
    availableActions: [WorkflowAction.SendInformation],
    initiator: {
      __typename: 'MarketParticipant' as const,
      id: initiatorId,
      glnOrEicNumber: processSecondaryMoveInInitiatorGln,
      displayName: `${processSecondaryMoveInInitiatorGln} • RSI 01 (Elleverandør)`,
    },
    initiatorRole: EicFunction.EnergySupplier,
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
  maskInitiator = false,
  cancelledByProcess = null,
}: {
  processId: string;
  apiBase: string;
  processIndex: number;
  initiators: Initiator[];
  createdAt: Date;
  cutoffDate: Date | null;
  businessReason: ProcessManagerBusinessReason;
  state: MeteringPointProcessState;
  availableActions: WorkflowAction[];
  initiator: Initiator;
  maskInitiator?: boolean;
  cancelledByProcess?: {
    id: string;
    businessReason: ProcessManagerBusinessReason;
    cutoffDate: Date;
  } | null;
}) {
  return {
    __typename: 'MeteringPointProcess' as const,
    id: processId,
    createdAt,
    cutoffDate,
    businessReason,
    state,
    availableActions,
    cancelledByProcess: cancelledByProcess
      ? {
          __typename: 'MeteringPointProcess' as const,
          ...cancelledByProcess,
        }
      : null,
    // When masked, the resolved participant is null but the role stays populated.
    initiator: maskInitiator ? null : initiatorFields(initiator).initiator,
    initiatorRole: initiator.role,
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
        actorRole: initiators[processIndex % initiators.length].role,
      },
      {
        // Masked step actor: the role is always populated, but the resolved
        // participant is null because this actor differs from the logged-in actor.
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
        actor: null,
        actorRole: EicFunction.SystemOperator,
      },
      // A canceled workflow gets a trailing cancellation step (RSM-004) whose
      // completedAt carries the cancellation timestamp. Mirrors the backend, where
      // the step's UniqueName is "Cancellation_Step" -> id CANCELLATION_STEP_V1_STEP_1.
      ...(state === MeteringPointProcessState.Canceled
        ? [
            {
              __typename: 'MeteringPointProcessStep' as const,
              id: `step-${processId}-cancellation`,
              step: 'CANCELLATION_STEP_V1_STEP_1',
              comment: null,
              completedAt: new Date('2026-02-17T08:26:00Z'),
              dueDate: null,
              state: MeteringPointProcessState.Succeeded,
              description: 'Cancellation step',
              documentUrl: null,
              actor: null,
              actorRole: null,
            },
          ]
        : []),
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
        role: EicFunction.GridAccessProvider,
      },
      {
        id: '0199ed3d-f1b2-7180-9546-39b5836fb576',
        displayName: '5790001330552 • Energinet',
        glnOrEicNumber: '5790001330552',
        role: EicFunction.SystemOperator,
      },
      {
        id: '0199ed3d-f1b2-7180-9546-39b5836fb577',
        displayName: '7080005056076 • Andel',
        glnOrEicNumber: '7080005056076',
        role: EicFunction.EnergySupplier,
      },
      {
        id: '0199ed3d-f1b2-7180-9546-39b5836fb578',
        displayName: '5790001687137 • Ørsted',
        glnOrEicNumber: '5790001687137',
        role: EicFunction.EnergySupplier,
      },
    ];

    // The overview row for this id, the source of truth for the drawer's shared fields.
    const base = getOverviewProcesses().find((p) => p.id === processId);

    // Index-derived fallback for ids not in the list (e.g. "process-001" -> 1).
    const numericMatch = processId.match(/\d+/);
    const processIndex = numericMatch ? Number.parseInt(numericMatch[0], 10) : 0;
    const fallbackCreatedAt = new Date('2025-01-01T10:00:00Z');
    fallbackCreatedAt.setDate(fallbackCreatedAt.getDate() + processIndex * 2);
    const fallbackCutoff = new Date(fallbackCreatedAt);
    fallbackCutoff.setDate(fallbackCutoff.getDate() + 3);

    const allStates = [
      MeteringPointProcessState.Pending,
      MeteringPointProcessState.Running,
      MeteringPointProcessState.Succeeded,
      MeteringPointProcessState.Failed,
      MeteringPointProcessState.Canceled,
      MeteringPointProcessState.Rejected,
    ];

    // Prefer the overview row's values, then knownProcesses, then index-derived defaults.
    const known = knownProcesses[processId];
    const safeIndex = Math.max(processIndex, 1) - 1;
    // Ternary, not `??`: a Pending row's null cutoffDate is real and must not fall back.
    const createdAt = base ? base.createdAt : fallbackCreatedAt;
    const cutoffDate = base ? base.cutoffDate : fallbackCutoff;
    const businessReason =
      base?.businessReason ??
      known?.businessReason ??
      translatedBusinessReasons[safeIndex % translatedBusinessReasons.length];
    const state = base?.state ?? known?.state ?? allStates[safeIndex % allStates.length];
    const availableActions =
      base?.availableActions ??
      known?.availableActions ??
      getAvailableActions(businessReason, state);

    const baseInitiator = initiators[processIndex % initiators.length];
    const initiatorWithGln = known?.initiatorGln
      ? {
          ...baseInitiator,
          glnOrEicNumber: known.initiatorGln,
          displayName: `${known.initiatorGln} • Test`,
        }
      : baseInitiator;
    const initiator = known?.initiatorRole
      ? { ...initiatorWithGln, role: known.initiatorRole }
      : initiatorWithGln;

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
                maskInitiator: known?.maskInitiator ?? false,
                cancelledByProcess: known?.cancelledByProcess ?? null,
              });

    // Reconcile the special builders' own dates with the overview row (no-op for the
    // generic path, which already used these dates).
    const reconciled = base
      ? { ...meteringPointProcessById, createdAt, cutoffDate }
      : meteringPointProcessById;

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        meteringPointProcessById: reconciled,
      },
    });
  });
}
