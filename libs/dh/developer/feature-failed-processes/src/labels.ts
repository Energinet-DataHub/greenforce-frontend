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
import { translate } from '@jsverse/transloco';

import type { WattBadgeType } from '@energinet/watt/badge';
import { FailedProcessSuspendReason } from '@energinet-datahub/dh/shared/domain/graphql';

import { FailedProcess } from './types';

// Reuses the shared process-type table (e.g. BRS_002_EndOfSupply -> "Leveranceophør (BRS-002)").
// Falls back to the raw composite key for unknown types and to "-" when the type is missing.
export function dhFailedProcessTypeLabel(processType: string | null | undefined): string {
  if (!processType) return '-';
  const key = `meteringPoint.processOverview.processType.${processType}`;
  const label = translate(key);
  return label === key ? processType : label;
}

// "<gln> · <name> (<role label>)", matching the owner format from the overview drawings.
export function dhFailedProcessOwnerLabel(
  createdBy: FailedProcess['createdBy'] | undefined
): string {
  if (!createdBy) return '-';
  const role = translate(`marketParticipant.marketRoles.${createdBy.marketRole}`);
  return `${createdBy.glnOrEicNumber} · ${createdBy.name} (${role})`;
}

export function dhSuspendReasonBadgeType(reason: FailedProcessSuspendReason): WattBadgeType {
  switch (reason) {
    case FailedProcessSuspendReason.UnhandledFailure:
    case FailedProcessSuspendReason.OrchestrationFailed:
      return 'danger';
    case FailedProcessSuspendReason.RetryDurationExceeded:
    case FailedProcessSuspendReason.UserRequested:
      return 'warning';
  }
}
