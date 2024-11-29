/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
import { mount } from 'cypress/angular';
import '@testing-library/cypress/add-commands';

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      mount: typeof mount;
      typeDateRange: (formControlName: string, start: string, end: string) => void;
      selectOption: (formControlName: string, option: string) => void;
    }
  }
}

Cypress.Commands.add('typeDateRange', (formControlName, start, end) => {
  start = start.replace('-', '');
  end = end.replace('-', '');

  cy.get(`[formcontrolname="${formControlName}"], input[class="mask-input"]`).type(
    `${start}${end}`
  );
});

Cypress.Commands.add('selectOption', (formControlName, option) => {
  cy.get(`[formcontrolname="${formControlName}"]`).click();
  cy.findByRole('option', { name: option }).click();
});

Cypress.Commands.add('mount', mount);
