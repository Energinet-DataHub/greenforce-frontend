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
import { LoginPo } from '../../page-objects';

const login = new LoginPo();

const clientId = '529a55d0-68c7-4129-ba3c-e06d4f1038c4';

Given('I am on the "Dexiflao" application homepage', () => {
  cy.visit(`/assets/html/onboarding-demo.html?client-id=${clientId}`);
});

When('I click on the button with text "start onboarding"', () => {
  cy.contains('button', /^start onboarding$/i).click();
});

Then('I should be redirected to the OIDC mock login page', () => {
  cy.location('pathname', { timeout: 10000 }).should('include', '/auth/oidc-mock');
});

When('I click on the user with name "Charlotte CSR"', () => {
  login.clickCharlotteLogin();
});

Then('I should see the consent management dialog', () => {
  // Check redirect to the consent page is happening
  cy.location('pathname', { timeout: 10000 }).should('include', '/consent');

  cy.location('href').then(actualUrl => {
    const parsedUrl = new URL(actualUrl);

    // Check the client ID
    expect(parsedUrl.searchParams.get('third-party-client-id')).to.equal(clientId);

    // Check the redirect URL
    expect(parsedUrl.searchParams.get('redirect-url')).to.equal('http://localhost:4200/assets/html/onboarding-demo.html?some-custom-param=123');
  });

  // Check for the client name in the consent dialog
  cy.get('.watt-modal-content > h3').should('contain', 'Ranularg');
});
