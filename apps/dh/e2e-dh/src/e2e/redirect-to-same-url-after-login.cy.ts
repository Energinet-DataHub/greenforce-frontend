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
describe('Redirect to same URL after login', () => {
  it('should display correct page title', () => {
    const initialUrl = '/market-participant/actors';

    cy.login(Cypress.env('DH_E2E_USERNAME'), Cypress.env('DH_E2E_PASSWORD'), initialUrl);

    cy.visit(initialUrl);

    cy.findByRole('heading', {
      name: new RegExp('Aktører', 'i'),
      level: 2,
    });

    cy.findAllByText('Energinet DataHub A/S', { timeout: 10_000 }).should('exist');
  });
});
