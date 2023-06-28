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
import { danishDatetimeProviders } from '@energinet-datahub/watt/danish-date-time';
import { da as daTranslations } from '@energinet-datahub/dh/globalization/assets-localization';
import { MatLegacySnackBarModule } from '@angular/material/legacy-snack-bar';
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { graphQLProviders } from '@energinet-datahub/dh/shared/data-access-graphql';
import { translocoProviders } from '@energinet-datahub/dh/globalization/configuration-localization';
import { importProvidersFrom } from '@angular/core';
import { ApolloModule } from 'apollo-angular';
import { DhWholesaleStartComponent } from './dh-wholesale-start.component';

it('mounts', () => {
  cy.mount(DhWholesaleStartComponent, {
    providers: [
      importProvidersFrom(MatLegacySnackBarModule),
      graphQLProviders,
      translocoProviders,
      danishDatetimeProviders,
    ],
    imports: [ApolloModule, BrowserAnimationsModule, DhApiModule.forRoot(), HttpClientModule],
  });

  // Create batch with process type of balance fixing, with "invalid" period
  cy.selectOption('processType', daTranslations.wholesale.startBatch.processTypes.BALANCE_FIXING);
  cy.typeDateRange('dateRange', '04-05-2023', '05-05-2023');

  // Expect the alert to be visible due to "invalid" period
  cy.findByRole('alert').should('exist');

  // Submit the form
  cy.findByRole('button', { name: daTranslations.wholesale.startBatch.startLabel }).click();

  // Expect warning dialog to be visible
  cy.findByRole('dialog').should('exist');

  // Close the warning dialog
  cy.findByRole('button', { name: 'close' }).click();
  cy.findByRole('dialog').should('not.exist');

  // Change the process type to aggregation
  cy.selectOption('processType', daTranslations.wholesale.startBatch.processTypes.AGGREGATION);

  // Expect the alert to be hidden due to aggregation is selected
  cy.findByRole('alert').should('not.exist');

  // Submit the form
  cy.findByRole('button', { name: daTranslations.wholesale.startBatch.startLabel }).click();

  // Expect the dialog not to be open due to aggregation is selected
  cy.findByRole('dialog').should('not.exist');
});
