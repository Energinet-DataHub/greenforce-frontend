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

  cy.get(
    `[formcontrolname="${formControlName}"] mat-date-range-input + input[class="mask-input"]`
  ).type(`${start}${end}`);
});

Cypress.Commands.add('selectOption', (formControlName, option) => {
  cy.get(`[formcontrolname="${formControlName}"]`).click();
  cy.findByRole('option', { name: option }).click();
});

Cypress.Commands.add('mount', mount);
