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
import type {
  ElectricityMarketViewConnectionState,
  MeteringPointProcessState,
  ProcessManagerBusinessReason,
} from '@energinet-datahub/dh/shared/domain/graphql';

// Minimal structural shape both the overview process type and the details
// by-id process type are assignable to; used by action visibility gates.
export interface MeteringPointProcessForVisibility {
  readonly id: string;
  readonly businessReason: ProcessManagerBusinessReason;
  readonly state: MeteringPointProcessState;
  readonly cutoffDate?: Date | null;
  readonly createdAt: Date;
}

export interface ProcessActionContext {
  meteringPointId: string;
  internalMeteringPointId: string;
  processId: string;
  connectionState: ElectricityMarketViewConnectionState;
  cutoffDate?: Date | null;
  onSuccess?: () => void;
}
