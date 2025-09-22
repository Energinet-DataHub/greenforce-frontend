//#region License
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
//#endregion
describe('Language selection', () => {
  it(`toggle languages`, () => {
    // Given no language is selected
    // Then Danish translations are displayed
    cy.visit('/message-archive');

    cy.findByRole('heading', {
      name: new RegExp('Fremsøg forretningsbeskeder', 'i'),
    });

    // When English is selected
    // Then English translations are displayed
    cy.findByTestId('profileMenu').click({ force: true });
    cy.findByText('English').click({ force: true });

    // Handle the auto-opening modal
    cy.findByRole('dialog', {
      timeout: 10_000,
    }).should('exist');
    cy.findByRole('button', { name: /close/i }).click();
    cy.findByRole('dialog').should('not.exist');

    cy.findByRole('heading', {
      name: new RegExp('Search in request and response messages', 'i'),
    });

    // Given English is selected
    // When Danish is selected
    // Then Danish translations are displayed
    cy.findByTestId('profileMenu').click({ force: true });
    cy.findByText('Dansk').click({ force: true });

    cy.findByRole('heading', {
      name: new RegExp('Fremsøg forretningsbeskeder', 'i'),
    });
  });
});
