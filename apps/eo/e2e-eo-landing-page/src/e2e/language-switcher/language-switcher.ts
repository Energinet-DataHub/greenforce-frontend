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
import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Given('I open the landing page', () => {
  cy.visit('/');
});

When('I open the language switcher', () => {
  cy.get('eo-language-switcher', { timeout: 20000 }).should('exist');
  cy.contains('button, watt-button', /language/i, { timeout: 20000 })
    .first()
    .should('be.visible')
    .click({ force: true });
  cy.get('watt-modal', { timeout: 20000 }).should('exist');
});

Then('I should see the language dropdown', () => {
  cy.get('.watt-modal-content', { timeout: 10000 }).find('watt-dropdown').should('be.visible');
});

When('I choose {string} in the dropdown', (target: string) => {
  cy.get('.watt-modal-content', { timeout: 20000 })
    .find('watt-dropdown', { timeout: 10000 })
    .within(() => {
      cy.get('[aria-haspopup="listbox"], button, [role="combobox"]')
        .first()
        .should('be.visible')
        .click({ force: true });
    });

  const label = target.toLowerCase().includes('dan') ? /Danish|Dansk/i : new RegExp(target, 'i');

  cy.get('.cdk-overlay-container', { timeout: 10000 })
    .should('exist')
    .within(() => {
      cy.contains('[role="option"], button, watt-option, .watt-option, mat-option, .mat-option-text', label)
        .scrollIntoView()
        .click({ force: true });
    });
});

When('I save the language selection', () => {
  cy.get('watt-modal', { timeout: 10000 })
    .should('exist')
    .within(() => {
      cy.contains('watt-button, button', /^(save|gem)$/i).click({ force: true });
    });
});

Then('the document language should be {string}', (code: string) => {
  cy.document().its('documentElement.lang', { timeout: 10000 }).should('eq', code);
});


