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
import { ProcessManagerBusinessReason } from '@energinet-datahub/dh/shared/domain/graphql';

// Business reasons shared by more than one BRS process, where processType (the workflow
// description name, e.g. Brs_005 / Brs_038) is what tells them apart. Only E0G today.
const AMBIGUOUS_BUSINESS_REASONS = new Set<ProcessManagerBusinessReason>([
  ProcessManagerBusinessReason.DataAlignmentForMasterDataMeteringPoint,
]);

export interface ProcessTypeResolvable {
  processType?: string | null;
  businessReason: ProcessManagerBusinessReason;
}

// Translation-key segment for a process's type label: the business reason, except for reasons
// shared across BRS processes (BRS-005 vs BRS-038), where processType splits them.
export function resolveProcessTypeKey(process: ProcessTypeResolvable): string {
  return process.processType && AMBIGUOUS_BUSINESS_REASONS.has(process.businessReason)
    ? process.processType
    : process.businessReason;
}
