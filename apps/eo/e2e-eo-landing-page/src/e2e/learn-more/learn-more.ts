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

const basePath = '/';

Given('I open the landing page', () => {
  cy.visit(basePath);
});

When('I click the Learn More button', () => {
  cy.get('eo-learn-more button', { timeout: 10000 }).first().click({ force: true });
});

Then('I should see the Vimeo player', () => {
  cy.get('body', { timeout: 10000 }).within(() => {
    cy.get('.cdk-overlay-container eo-vimeo-player, eo-vimeo-player').should('exist');
    cy.get('.cdk-overlay-container img.poster-image, img.poster-image')
      .should('be.visible')
      .click({ force: true });
    cy.get(
      '.cdk-overlay-container iframe[src*="player.vimeo.com"], iframe[src*="player.vimeo.com"]',
      {
        timeout: 10000,
      }
    ).should('be.visible');
  });
});
