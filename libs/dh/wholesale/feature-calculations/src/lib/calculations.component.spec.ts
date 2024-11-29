import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { render, screen } from '@testing-library/angular';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ApolloModule } from 'apollo-angular';

import { graphQLProviders } from '@energinet-datahub/dh/shared/data-access-graphql';
import { getTranslocoTestingModule, MsalServiceMock } from '@energinet-datahub/dh/shared/test-util';
import { danishDatetimeProviders } from '@energinet-datahub/watt/danish-date-time';

import { DhCalculationsComponent } from './calculations.component';

async function setup() {
  await render(`<dh-calculations />`, {
    providers: [
      importProvidersFrom(MatSnackBarModule),
      graphQLProviders,
      danishDatetimeProviders,
      MsalServiceMock,
    ],
    imports: [ApolloModule, DhCalculationsComponent, getTranslocoTestingModule(), HttpClientModule],
  });
}

describe(DhCalculationsComponent, () => {
  it('should show filter chips', async () => {
    await setup();
    ['Calculation type', 'Calculation period', 'Execution type', 'Grid areas', 'Status']
      .map((filter) => screen.getByRole('button', { name: new RegExp(filter), pressed: false }))
      .forEach((element) => expect(element).toBeInTheDocument());
  });

  it('should show clear button', async () => {
    await setup();
    expect(screen.getByRole('button', { name: /Reset/ })).toBeInTheDocument();
  });

  it('should show search button', async () => {
    await setup();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });
});
