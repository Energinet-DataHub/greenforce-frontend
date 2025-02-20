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
import {
  CalculationExecutionType,
  CalculationType,
  ElectricalHeatingCalculation,
  GridAreaStatus,
  GridAreaType,
  MeteringPointType,
  PriceAreaCode,
  PriceType,
  ProcessState,
  ProcessStepState,
  RequestCalculatedEnergyTimeSeriesResult,
  RequestCalculatedWholesaleServicesResult,
  WholesaleAndEnergyCalculation,
} from '@energinet-datahub/dh/shared/domain/graphql';

const processes: (
  | ElectricalHeatingCalculation
  | RequestCalculatedEnergyTimeSeriesResult
  | RequestCalculatedWholesaleServicesResult
  | WholesaleAndEnergyCalculation
)[] = [
  {
    __typename: 'ElectricalHeatingCalculation',
    id: '1',
    startedAt: new Date('2022-01-01T00:00:00Z'),
    calculationType: CalculationType.Aggregation,
    createdAt: new Date('2022-01-01T00:00:00Z'),
    state: ProcessState.Running,
    executionType: CalculationExecutionType.External,
    steps: [
      {
        __typename: 'OrchestrationInstanceStep',
        isCurrent: true,
        state: ProcessStepState.Running,
      },
    ],
    createdBy: {
      __typename: 'AuditIdentityDto',
      auditIdentityId: '1',
      displayName: 'John Doe',
    },
    scheduledAt: new Date('2023-01-01T00:00:00Z'),
    terminatedAt: new Date('2024-01-01T00:00:00Z'),
  },
  {
    __typename: 'RequestCalculatedEnergyTimeSeriesResult',
    id: '2',
    createdAt: new Date('2022-01-01T00:00:00Z'),
    startedAt: new Date('2022-01-01T00:00:00Z'),
    meteringPointType: MeteringPointType.Production,
    state: ProcessState.Running,
    steps: [
      {
        __typename: 'OrchestrationInstanceStep',
        isCurrent: true,
        state: ProcessStepState.Running,
      },
    ],
    createdBy: {
      __typename: 'AuditIdentityDto',
      auditIdentityId: '1',
      displayName: 'John Doe',
    },
    scheduledAt: new Date('2023-01-01T00:00:00Z'),
    terminatedAt: new Date('2024-01-01T00:00:00Z'),
  },
  {
    __typename: 'RequestCalculatedWholesaleServicesResult',
    id: '3',
    createdAt: new Date('2022-01-01T00:00:00Z'),
    startedAt: new Date('2022-01-01T00:00:00Z'),
    priceType: PriceType.MonthlySubscription,
    state: ProcessState.Running,
    steps: [
      {
        __typename: 'OrchestrationInstanceStep',
        isCurrent: true,
        state: ProcessStepState.Running,
      },
    ],
    createdBy: {
      __typename: 'AuditIdentityDto',
      auditIdentityId: '1',
      displayName: 'John Doe',
    },
    scheduledAt: new Date('2023-01-01T00:00:00Z'),
    terminatedAt: new Date('2024-01-01T00:00:00Z'),
  },
  {
    __typename: 'WholesaleAndEnergyCalculation',
    id: '4',
    executionType: CalculationExecutionType.External,
    startedAt: new Date('2022-01-01T00:00:00Z'),
    gridAreas: [
      {
        __typename: 'GridAreaDto',
        code: 'DK1',
        includedInCalculation: true,
        name: 'DK1',
        priceAreaCode: PriceAreaCode.Dk1,
        status: GridAreaStatus.Active,
        type: GridAreaType.Distribution,
        validFrom: new Date('2022-01-01T00:00:00Z'),
        validTo: new Date('2023-01-01T00:00:00Z'),
        id: '1',
        displayName: 'DK1',
      },
    ],
    calculationType: CalculationType.Aggregation,
    period: {
      end: new Date('2023-01-01T00:00:00Z'),
      start: new Date('2022-01-01T00:00:00Z'),
    },
    createdAt: new Date('2022-01-01T00:00:00Z'),
    state: ProcessState.Running,
    steps: [
      {
        __typename: 'OrchestrationInstanceStep',
        isCurrent: true,
        state: ProcessStepState.Running,
      },
    ],
    createdBy: {
      __typename: 'AuditIdentityDto',
      auditIdentityId: '1',
      displayName: 'John Doe',
    },
    scheduledAt: new Date('2023-01-01T00:00:00Z'),
    terminatedAt: new Date('2024-01-01T00:00:00Z'),
  },
];

export default processes;
