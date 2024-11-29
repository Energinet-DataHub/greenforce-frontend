import { By } from '@angular/platform-browser';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { render, RenderResult } from '@testing-library/angular';
import { ApolloModule } from 'apollo-angular';
import { importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

import { graphQLProviders } from '@energinet-datahub/dh/shared/data-access-graphql';

import { danishDatetimeProviders } from '@energinet-datahub/watt/danish-date-time';
import { WattShellComponent } from '@energinet-datahub/watt/shell';
import { getTranslocoTestingModule, MsalServiceMock } from '@energinet-datahub/dh/shared/test-util';
import { WattModalService } from '@energinet-datahub/watt/modal';

import { DhCoreShellComponent } from './dh-core-shell.component';

describe(DhCoreShellComponent, () => {
  beforeEach(async () => {
    view = await render(DhCoreShellComponent, {
      imports: [getTranslocoTestingModule(), HttpClientModule, ApolloModule],
      providers: [
        MsalServiceMock,
        danishDatetimeProviders,
        WattModalService,
        provideHttpClientTesting(),
        graphQLProviders,
        importProvidersFrom([MatDialogModule]),
      ],
    });
  });

  let view: RenderResult<DhCoreShellComponent>;

  it('displays the Watt shell', () => {
    const wattShell = view.fixture.debugElement.query(By.directive(WattShellComponent));

    expect(wattShell.componentInstance).toBeInstanceOf(WattShellComponent);
  });
});
