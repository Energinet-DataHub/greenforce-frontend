import { InjectionToken } from '@angular/core';

import { environment } from '../environment';

export interface DhApiEnvironment {
  readonly apiBase: string;
}

export const dhApiEnvironmentToken = new InjectionToken<DhApiEnvironment>(
  'dhApiEnvironmentToken',
  {
    factory: (): DhApiEnvironment => {
      if (environment.production) {
        throw new Error('No DataHub API environment provided.');
      }

      return {
        apiBase: 'https://localhost:5001',
      };
    },
    providedIn: 'platform',
  }
);
