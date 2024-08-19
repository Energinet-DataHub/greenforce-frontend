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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloModule } from 'apollo-angular';

import { danishDatetimeProviders } from '@energinet-datahub/watt/core/datetime';
import { da as daTranslations } from '@energinet-datahub/dh/globalization/assets-localization';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { graphQLProviders } from '@energinet-datahub/dh/shared/data-access-graphql';
import { translocoProviders } from '@energinet-datahub/dh/globalization/configuration-localization';

import { DhCalculationsComponent } from './calculations.component';
import { FormGroupDirective } from '@angular/forms';
import { MsalServiceMock } from '@energinet-datahub/dh/shared/test-util-auth';

const { calculations } = daTranslations.wholesale;

it.skip('mounts', () => {
  cy.mount(DhCalculationsComponent, {
    providers: [
      importProvidersFrom(MatSnackBarModule),
      graphQLProviders,
      translocoProviders,
      danishDatetimeProviders,
      FormGroupDirective,
      MsalServiceMock,
    ],
    imports: [
      ApolloModule,
      BrowserAnimationsModule,
      DhApiModule.forRoot(),
      HttpClientModule,
      RouterTestingModule,
    ],
  });

  // Click on "Ny beregning" button
  cy.findByRole('button', { name: new RegExp(calculations.new) }).click();

  // Expect dialog to be visible
  cy.findByRole('dialog').should('exist');

  // Create calculation with calculation type of balance fixing and with "invalid" period
  cy.selectOption('calculationType', daTranslations.wholesale.shared.BALANCE_FIXING);
  cy.typeDateRange('dateRange', '04-05-2023', '05-05-2023');

  // Expect the alert to be visible due to "invalid" period
  cy.findByRole('alert').should('exist');

  // Submit the form
  cy.findByRole('button', { name: calculations.create.confirm }).click();

  // Expect alert to be visible
  cy.findByRole('alert').should('exist');

  // Close the warning dialog
  cy.findByRole('button', { name: calculations.create.warning.cancel }).click();

  // Expect the dialog to be hidden
  cy.findByRole('dialog').should('not.exist');

  // Click on "Ny beregning" button
  cy.findByRole('button', { name: new RegExp(calculations.new) }).click();

  // Change the calculation type to aggregation
  cy.selectOption('calculationType', daTranslations.wholesale.shared.AGGREGATION);
  cy.typeDateRange('dateRange', '04-05-2023', '05-05-2023');

  // Expect the alert to be hidden due to aggregation is selected
  cy.findByRole('alert').should('not.exist');

  // Submit the form
  cy.findByRole('button', { name: calculations.create.confirm }).click();

  // Expect the dialog not to be open due to aggregation is selected
  cy.findByRole('dialog').should('not.exist');
});
