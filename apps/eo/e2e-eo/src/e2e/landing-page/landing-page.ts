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
  cy.get('h1').should('contain.text', 'Your emissions and renewables overview');
});

When('I can see a cookie consent popup', () => {
  cy.get('eo-cookie-banner').should('be.visible');
  cy.get('[data-testid="button-only-necessary"]').should('be.visible');
  cy.get('[data-testid="button-accept-all"]').should('be.visible');
});

When("I click the 'only necessary' button", () => {
  cy.get('[data-testid="button-only-necessary"]').click();
});

Then('The popup closes', () => {
  cy.get('eo-cookie-banner').should('not.exist');
});

Then('I can see 3 start buttons', () => {
  cy.get('eo-landing-page-login-button').should('have.length', 3);
});

Then('I can see a footer with content in it', () => {
  cy.get('eo-footer').should('be.visible');
  cy.get('eo-footer').get('img[alt="Energinet"].logo').should('be.visible');
  cy.get('eo-footer').get('a[aria-label="privacypolicy"]').should('be.visible');
  cy.get('eo-footer').get('a[aria-label="accessibility"]').should('be.visible');
  cy.get('eo-footer').get('a[aria-label="phone"]').should('be.visible');
  cy.get('eo-footer').get('a[aria-label="email"]').should('be.visible');
});
