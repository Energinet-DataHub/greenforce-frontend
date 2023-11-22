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
import { By } from '@angular/platform-browser';
import { RouterOutlet, provideRouter } from '@angular/router';
import { render } from '@testing-library/angular';

import { DataHubAppComponent } from './datahub-app.component';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { MsalGuardMock, MsalServiceMock } from '@energinet-datahub/dh/shared/test-util-auth';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { dhCoreShellProviders, dhCoreShellRoutes } from '@energinet-datahub/dh/core/shell';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

describe(DataHubAppComponent, () => {
  it('has a router outlet', async () => {
    const view = await render(DataHubAppComponent);

    const routerOutlet = view.fixture.debugElement
      .query(By.directive(RouterOutlet))
      ?.injector.get(RouterOutlet);

    expect(routerOutlet).toBeInstanceOf(RouterOutlet);
  });

  it('navigation works', async () => {
    const { navigate } = await render(DataHubAppComponent, {
      providers: [
        provideRouter(dhCoreShellRoutes),
        provideNoopAnimations(),
        provideHttpClient(),
        ...dhCoreShellProviders,
        MsalServiceMock,
        MsalGuardMock,
        importProvidersFrom(getTranslocoTestingModule()),
      ],
    });

    const didNavigationSucceed = await navigate('/');

    expect(didNavigationSucceed).toBe(true);
  });
});
