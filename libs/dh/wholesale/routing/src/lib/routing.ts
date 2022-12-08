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
import { Router } from '@angular/router';
import { BatchDto, GridAreaDto } from '@energinet-datahub/dh/shared/domain';

export const WHOLESALE_BASE_PATH = 'wholesale';
export const WHOLESALE_START_PROCESS_PATH = 'start-process';
export const WHOLESALE_SEARCH_BATCH_PATH = 'search-batch';
export const WHOLESALE_CALCULATION_STEPS_PATH = `calculation-steps`;

export function navigateToWholesaleCalculationSteps(
  router: Router,
  batch: BatchDto,
  gridArea: GridAreaDto
) {
  router.navigate(
    [
      WHOLESALE_BASE_PATH,
      WHOLESALE_CALCULATION_STEPS_PATH,
      batch.batchId,
      gridArea.code,
    ],
    {
      state: { batch: batch, gridArea: gridArea },
    }
  );
}

export function navigateToWholesaleSearchBatch(
  router: Router,
  batchId?: string
) {
  return router.navigate([WHOLESALE_BASE_PATH, WHOLESALE_SEARCH_BATCH_PATH], {
    queryParams: batchId ? { batch: batchId } : null,
  });
}
