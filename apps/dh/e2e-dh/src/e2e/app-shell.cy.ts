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
describe('Application shell', () => {
  it('should display welcome message', () => {
    cy.visit('/message-archive');

    // Handle the auto-opening modal
    cy.get('watt-modal').within(() => {
      // Click the "Søg" (Search) button to close the modal
      cy.contains('button', 'Søg').click();
    });
    
    cy.findByRole('heading', {
      name: new RegExp('Fremsøg forretningsbeskeder', 'i'),
    });

    cy.get('.selected-organization-name-label', { timeout: 10_000 }).click();

    cy.findAllByText('Energinet DataHub A/S').should('exist');
  });
});
