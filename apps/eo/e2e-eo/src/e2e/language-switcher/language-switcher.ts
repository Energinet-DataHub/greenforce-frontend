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
