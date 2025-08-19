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
import { LoginPo } from '../../page-objects';
import { LanguageSwitcherPo } from './language-switcher.po';

const login = new LoginPo();
const lang = new LanguageSwitcherPo();

Given('I am logged in as Charlotte CSR', () => {
  // Go straight to the mock login page and click Charlotte
  login.visit();
  login.clickCharlotteLogin();

  // Back to the app (no longer on the OIDC mock)
  cy.location('pathname', { timeout: 20000 }).should('not.include', '/auth/oidc-mock');

  // Ensure the app is ready and the language switcher is present
  cy.get('app-root', { timeout: 30000 }).should('exist');
  cy.get('eo-language-switcher', { timeout: 30000 }).should('be.visible');
});

When('I open the language switcher', () => {
  lang.open();
  lang.modal().should('exist'); // modal shown
});

Then('I should see the language dropdown', () => {
  lang.dropdown().should('exist').and('be.visible');
});

When('I choose {string} in the dropdown', (target: string) => {
  // Open dropdown panel
  lang.dropdown().click({ force: true });

  // Accept both English and Danish labels
  const label = target.toLowerCase().includes('dan') ? /Danish|Dansk/i : new RegExp(target, 'i');

  // Options often render in overlays; search body-wide
  cy.get('body', { timeout: 10000 }).within(() => {
    cy.contains(
      '.cdk-overlay-container [role="option"], ' +
        '.cdk-overlay-container button, ' +
        '[role="option"], ' +
        'watt-option, .watt-option, ' +
        'mat-option, mat-option .mat-option-text',
      label
    ).click({ force: true });
  });
});

When('I save the language selection', () => {
  // Works for both English ("Save") and Danish ("Gem")
  lang.modal().within(() => {
    cy.contains('watt-button', /^(save|gem)$/i).click({ force: true });
  });
});

Then('the document language should be {string}', (code: string) => {
  cy.document().its('documentElement.lang', { timeout: 10000 }).should('eq', code);
});
