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
import { DA_TRANSLATIONS } from '@energinet-datahub/eo/globalization/assets-localization/i18n/da';
import { EN_TRANSLATIONS } from '@energinet-datahub/eo/globalization/assets-localization/i18n/en';

const overlay = () => cy.get('.cdk-overlay-container', { timeout: 20000 });

Given('I open the landing page', () => {
  cy.visit('/');
});

When('I open the language switcher', () => {
  cy.get('eo-language-switcher', { timeout: 20000 })
    .should('be.visible')
    .click();
  overlay().find('[role="dialog"], watt-modal, .mat-dialog-container').should('be.visible');
});

Then('I should see the language dropdown', () => {
  overlay().find('watt-dropdown').should('be.visible');
});

When('I choose {string} in the dropdown', (target: string) => {
  overlay()
    .find('watt-dropdown')
    .within(() => {
      cy.get('[aria-haspopup="listbox"], [role="combobox"], button')
        .should('be.visible')
        .first()
        .click();
    });

  const lowered = target.toLowerCase();
  const value: 'da' | 'en' =
    lowered.startsWith('da') ? 'da' : lowered.startsWith('en') ? 'en' : 'da';

  const optionLabels = [
    EN_TRANSLATIONS.languageSwitcher.languages[value],
    DA_TRANSLATIONS.languageSwitcher.languages[value],
  ];

  const selector =
    '[role="option"], watt-option, .watt-option, mat-option, .mat-option-text, button';

  cy.contains(selector, new RegExp(optionLabels.join('|'), 'i'))
    .scrollIntoView()
    .should('be.visible')
    .click();
});

When('I save the language selection', () => {
  overlay()
    .find(
      'watt-modal-actions button[variant="primary"], watt-modal-actions watt-button[variant="primary"] button',
    )
    .should('be.visible')
    .and('not.be.disabled')
    .first()
    .scrollIntoView()
    .click();

  overlay().find('[role="dialog"], watt-modal, .mat-dialog-container').should('not.exist');
});

Then('the document language should be {string}', (code: string) => {
  cy.get('html', { timeout: 30000 }).should('have.attr', 'lang', code);
});
