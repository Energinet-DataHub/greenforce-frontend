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

Given('I am logged in as Charlotte CSR', () => {
  cy.visit('/');
  cy.get('[data-testid="button-only-necessary"]').click();
  cy.get('eo-landing-page-login-button').eq(0).click();
  cy.get('[value="Charlotte CSR"]').click();
  cy.url().should('not.contain', 'auth/oidc-mock');
});

When('I am on the dashboard page', () => {
  cy.url().should('contain', 'dashboard');
  cy.get('h2').should('contain.text', 'Dashboard');
});

Then('I can see the a pie-chart component', () => {
  cy.get('eo-dashboard-chart-card').should(
    'contain.html',
    'eo-origin-of-energy-pie-chart'
  );
});
Then('I can see an emissions data component', () => {
  cy.get('eo-dashboard-emissions-card').should(
    'contain.html',
    'eo-emissions-data'
  );
});

Then('I can see an hourly declaration component', () => {
  cy.get('eo-dashboard-hourly-declaration').should('be.visible');
});

Then('I can see a link collection component', () => {
  cy.get('eo-dashboard-links').should('be.visible');
  cy.get('eo-dashboard-links a').should('have.length', 4);
});
Then('I can see a component for exporting data for CSR', () => {
  cy.get('eo-dashboard-get-datad').should('be.visible');
});
