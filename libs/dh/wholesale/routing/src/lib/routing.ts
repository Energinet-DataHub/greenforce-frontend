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
import { Route, Router } from '@angular/router';
import {
  BatchDtoV2,
  GridAreaDto,
} from '@energinet-datahub/dh/shared/domain';

export const WHOLESALE_BASE_PATH = 'wholesale';
const WHOLESALE_START_PROCESS_PATH = 'start-process';
const WHOLESALE_SEARCH_BATCH_PATH = 'search-batch';
const WHOLESALE_CALCULATION_STEPS_PATH = `calculation-steps`;

export const WHOLESALE_ROUTES: Route[] = [
  {
    path: WHOLESALE_START_PROCESS_PATH,
    loadComponent: () =>
      import('@energinet-datahub/dh/wholesale/feature-start').then(
        (m) => m.DhWholesaleStartComponent
      ),
    data: {
      titleTranslationKey: 'wholesale.startBatch.topBarTitle',
    },
  },
  {
    path: WHOLESALE_SEARCH_BATCH_PATH,
    loadComponent: () =>
      import('@energinet-datahub/dh/wholesale/feature-search').then(
        (m) => m.DhWholesaleSearchComponent
      ),
    data: {
      titleTranslationKey: 'wholesale.searchBatch.topBarTitle',
    }
  },
  {
    path: `${WHOLESALE_CALCULATION_STEPS_PATH}/:batchId/:gridAreaCode`,
    loadComponent: () =>
      import('@energinet-datahub/dh/wholesale/feature-calculation-steps').then(
        (m) => m.DhWholesaleCalculationStepsComponent
      ),
    data: {
      titleTranslationKey: 'wholesale.calculationSteps.topBarTitle',
    },
  },
];

export function navigateToWholesaleCalculationSteps(
  router: Router,
  batch: BatchDtoV2,
  gridArea: GridAreaDto
) {
  router.navigate(
    [
      WHOLESALE_BASE_PATH,
      WHOLESALE_CALCULATION_STEPS_PATH,
      batch.batchNumber,
      gridArea.code,
    ],
    {
      state: { batch: batch, gridArea: gridArea },
    }
  );
}

export function navigateToWholesaleSearchBatch(
  router: Router,
  batchNumber?: string
) {
  return router.navigate([WHOLESALE_BASE_PATH, WHOLESALE_SEARCH_BATCH_PATH], {
    queryParams: batchNumber ? { batch: batchNumber } : null,
  });
}
