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
