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
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { RouterOutlet, provideRouter } from '@angular/router';
import { render } from '@testing-library/angular';

import {
  getTranslocoTestingModule,
  MsalGuardMock,
  MsalServiceMock,
} from '@energinet-datahub/dh/shared/test-util';
import { dhCoreShellProviders, dhCoreShellRoutes } from '@energinet-datahub/dh/core/shell';

import { DataHubAppComponent } from './datahub-app.component';

describe(DataHubAppComponent, () => {
  const providers = [
    provideRouter(dhCoreShellRoutes),
    provideNoopAnimations(),
    provideHttpClient(),
    ...dhCoreShellProviders,
    MsalServiceMock,
    MsalGuardMock,
    importProvidersFrom(getTranslocoTestingModule()),
    provideServiceWorker('', {
      enabled: false,
    }),
  ];

  it('has a router outlet', async () => {
    const view = await render(DataHubAppComponent, { providers });
    const routerOutlet = view.fixture.debugElement
      .query(By.directive(RouterOutlet))
      ?.injector.get(RouterOutlet);

    expect(routerOutlet).toBeInstanceOf(RouterOutlet);
  });

  it('navigation works', async () => {
    const { navigate } = await render(DataHubAppComponent, { providers });
    const didNavigationSucceed = await navigate('/');

    expect(didNavigationSucceed).toBe(true);
  });
});
