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
import { LanguageSwitcherPo } from './language-switcher.po';

const lang = new LanguageSwitcherPo();

Given('I am on the English landing page', () => {
  cy.visit('/en');
  cy.get('eo-landing-page-header', { timeout: 20000 }).should('be.visible');
});

When('I open the language switcher', () => {
  lang.open();
  lang.modal().should('exist'); // modal is shown
});

Then('I should see the language dropdown', () => {
  lang.dropdown().should('exist');
});

When('I choose {string} in the dropdown', (target: string) => {
  // Open the dropdown panel
  lang.dropdown().click({ force: true });

  const label = target.toLowerCase().includes('dan')
    ? /Danish|Dansk/i
    : new RegExp(target, 'i');

  cy.get('body', { timeout: 10000 }).within(() => {
    cy.contains(
      'mat-option .mat-option-text, mat-option, [role="option"], watt-option, .watt-option',
      label
    ).click({ force: true });
  });
});

When('I save the language selection', () => {
  lang.modal().within(() => {
    cy.contains('watt-button', /^(save|gem)$/i).click({ force: true });
  });
});

Then('the document language should be {string}', (code: string) => {
  cy.document().its('documentElement.lang').should('eq', code);
});
