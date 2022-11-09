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

When('I can see Charlotte CSRs login and click it', () => {
  cy.get('[value="Charlotte CSR"]').click();
});

Then('I can see the dashboard page', () => {
  cy.get('h2').should('contain.text', 'Dashboard');
});
