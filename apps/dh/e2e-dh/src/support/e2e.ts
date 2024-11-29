// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import './commands';

beforeEach(() => {
  if (!['b2c-healthchecks.cy.ts'].includes(Cypress.spec.name)) {
    cy.login(Cypress.env('DH_E2E_USERNAME'), Cypress.env('DH_E2E_PASSWORD'));
  }
});
