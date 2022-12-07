import { Route } from '@angular/router';

import {
  WHOLESALE_START_PROCESS_PATH,
  WHOLESALE_SEARCH_BATCH_PATH,
  WHOLESALE_CALCULATION_STEPS_PATH,
} from '@energinet-datahub/dh/wholesale/routing';

export const WHOLESALE_SHELL: Route[] = [
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
    },
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
