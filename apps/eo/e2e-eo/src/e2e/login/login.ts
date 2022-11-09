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
import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Given('I am on the landing page', () => {
  cy.visit('/');
});

When('I click the start button to login', () => {
  cy.get('eo-landing-page-login-button').eq(0).click();
});

When('I see Charlotte CSRs login button and click it', () => {
  cy.get('[value="Charlotte CSR"]').click();
});

When("I see Thomas Tesla's login button and click it", () => {
  cy.get('[value="Thomas Tesla"]').click();
});

When('I see Ivan Iværksætters login button and click it', () => {
  cy.get('[value="Ivan Iværksætter"]').click();
});

Then('I can see the dashboard page', () => {
  cy.get('h2').should('contain.text', 'Dashboard');
  cy.get('a.mat-list-item').contains('Log out').click();
});

Then('I am on the landing page again with an error in the URL', () => {
  cy.get('h1').should('contain.text', 'Your emissions and renewables overview');
  cy.url().should(
    'contain',
    'Private%20users%20are%20not%20allowed%20to%20login'
  );
});
