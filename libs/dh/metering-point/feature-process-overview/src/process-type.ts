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
import type { TranslocoService } from '@jsverse/transloco';

import type { ProcessManagerBusinessReason } from '@energinet-datahub/dh/shared/domain/graphql';

const PROCESS_TYPE_PREFIX = 'meteringPoint.processOverview.processType';

export interface ProcessTypeResolvable {
  processType?: string | null;
  businessReason: ProcessManagerBusinessReason;
}

/**
 * Resolves the translation-key segment used to label a process's type.
 *
 * Prefers `processType` (the process-manager workflow short name, e.g. `Brs_005` /
 * `Brs_038`) when a dedicated translation exists for it under `processType.*`;
 * otherwise falls back to `businessReason`. This splits BRS-005 and BRS-038, which
 * share `businessReason = DataAlignmentForMasterDataMeteringPoint`, while preserving
 * every existing label (reasons without a dedicated `processType.*` key keep their
 * distinct `businessReason` label, e.g. CustomerMoveIn vs SecondaryMoveIn).
 *
 * The override is gated on translation existence (the generic primitive), not on any
 * hardcoded BRS list, so new discriminators only need a translation key to take effect.
 */
export function resolveProcessTypeKey(
  transloco: TranslocoService,
  process: ProcessTypeResolvable
): string {
  const { processType, businessReason } = process;
  if (processType && hasProcessTypeTranslation(transloco, processType)) {
    return processType;
  }
  return businessReason;
}

// Assumes da.json and en.json carry the same processType.* key set, so the resolved key is
// language-invariant; only the rendered label (via a reactive `t(...)`) changes on language switch.
function hasProcessTypeTranslation(transloco: TranslocoService, segment: string): boolean {
  // Transloco stores translations as a flat map keyed by full dotted paths (see how
  // `translate` reads `translation[key]` directly), so membership of the dotted key
  // is a robust existence check across both the nested-source and AOT-flattened builds.
  const translation = transloco.getTranslation(transloco.getActiveLang());
  return `${PROCESS_TYPE_PREFIX}.${segment}` in translation;
}
