import { makeEnvironmentProviders } from '@angular/core';
import {
  RX_RENDER_STRATEGIES_CONFIG,
  RxRenderStrategiesConfig,
} from '@rx-angular/cdk/render-strategies';

/**
 * Enable RxAngular Template to render in Jest tests.
 */
export const gfRxAngularTestingProviders = makeEnvironmentProviders([
  {
    provide: RX_RENDER_STRATEGIES_CONFIG,
    useValue: {
      primaryStrategy: 'native',
    } as RxRenderStrategiesConfig<string>,
  },
]);
