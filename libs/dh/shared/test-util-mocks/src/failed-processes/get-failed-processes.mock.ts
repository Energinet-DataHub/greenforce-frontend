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
import { delay, HttpResponse } from 'msw';
import { mswConfig } from '@energinet-datahub/gf/msw/test-util-msw-setup';
import { mockGetFailedProcessesQuery } from '@energinet-datahub/dh/shared/domain/graphql/msw';
import {
  EicFunction,
  FailedProcessSuspendReason,
} from '@energinet-datahub/dh/shared/domain/graphql';

const items = [
  {
    __typename: 'FailedProcess' as const,
    id: '0199f1c2-a3b4-7180-9546-39b5836fb001',
    processType: 'BRS_002_EndOfSupply',
    meteringPointId: '571397488097288280',
    createdAt: new Date('2026-06-10T10:48:00Z'),
    suspendedAt: new Date('2026-06-10T11:02:00Z'),
    suspendReason: FailedProcessSuspendReason.UnhandledFailure,
    suspendContext:
      'System.InvalidOperationException: Failed to resolve energy supplier for metering point 571397488097288280 at Energinet.DataHub.ProcessManager.Orchestrations.Processes.BRS_002.EndOfSupplyHandler.HandleAsync(EndOfSupplyInput input) in /src/Processes/BRS_002/EndOfSupplyHandler.cs:line 87',
    orchestrationInstanceId: '0199f1c2-a3b4-7180-9546-39b5836fbf01',
    createdBy: {
      __typename: 'MarketParticipant' as const,
      id: '0199f1c2-a3b4-7180-9546-39b5836fba01',
      name: 'Netvirksomhed 01',
      glnOrEicNumber: '1899805560104',
      marketRole: EicFunction.GridAccessProvider,
    },
  },
  {
    __typename: 'FailedProcess' as const,
    id: '0199f1c2-a3b4-7180-9546-39b5836fb002',
    processType: 'BRS_009_CustomerMoveIn',
    meteringPointId: '571313180400090019',
    createdAt: new Date('2026-06-08T07:15:00Z'),
    suspendedAt: new Date('2026-06-09T07:15:00Z'),
    suspendReason: FailedProcessSuspendReason.RetryDurationExceeded,
    suspendContext: null,
    orchestrationInstanceId: '0199f1c2-a3b4-7180-9546-39b5836fbf02',
    createdBy: {
      __typename: 'MarketParticipant' as const,
      id: '0199f1c2-a3b4-7180-9546-39b5836fba02',
      name: 'Andel Energi',
      glnOrEicNumber: '7080005056076',
      marketRole: EicFunction.EnergySupplier,
    },
  },
  {
    __typename: 'FailedProcess' as const,
    id: '0199f1c2-a3b4-7180-9546-39b5836fb003',
    processType: 'BRS_001_ChangeOfEnergySupplier',
    meteringPointId: '571313180400090033',
    createdAt: new Date('2026-05-28T14:30:00Z'),
    suspendedAt: new Date('2026-05-28T14:31:00Z'),
    suspendReason: FailedProcessSuspendReason.OrchestrationFailed,
    suspendContext: 'Orchestration failed before the first activity was scheduled.',
    orchestrationInstanceId: '0199f1c2-a3b4-7180-9546-39b5836fbf03',
    createdBy: {
      __typename: 'MarketParticipant' as const,
      id: '0199f1c2-a3b4-7180-9546-39b5836fba03',
      name: 'Ørsted Salg & Service',
      glnOrEicNumber: '5790001687137',
      marketRole: EicFunction.EnergySupplier,
    },
  },
  {
    __typename: 'FailedProcess' as const,
    id: '0199f1c2-a3b4-7180-9546-39b5836fb004',
    processType: null,
    meteringPointId: '571313180400090047',
    createdAt: new Date('2026-05-20T09:00:00Z'),
    suspendedAt: new Date('2026-05-20T09:05:00Z'),
    suspendReason: FailedProcessSuspendReason.UserRequested,
    suspendContext: null,
    orchestrationInstanceId: '0199f1c2-a3b4-7180-9546-39b5836fbf04',
    createdBy: null,
  },
];

export function getFailedProcesses() {
  return mockGetFailedProcessesQuery(async () => {
    await delay(mswConfig.delay);

    return HttpResponse.json({
      data: {
        __typename: 'Query',
        failedProcesses: {
          __typename: 'FailedProcessesResult' as const,
          totalCount: items.length,
          items,
        },
      },
    });
  });
}
