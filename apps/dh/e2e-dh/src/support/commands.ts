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
import '@testing-library/cypress/add-commands';

function loginViaB2C(email: string, password: string, initialUrl: string) {
  cy.findByRole('button').click();

  // Login to B2C.
  cy.origin(
    Cypress.env('DH_E2E_B2C_URL'),
    {
      args: {
        email,
        password,
      },
    },
    ({ email, password }) => {
      cy.get('#email').type(email, {
        log: false,
      });
      cy.get('#password').type(password, {
        log: false,
      });
      cy.get('#next').click();
    }
  );

  // Ensure Microsoft has redirected us back to the app with our logged in user.
  if (initialUrl === '/') {
    cy.url().should('equals', Cypress.config('baseUrl') + '/message-archive');
  } else {
    cy.url().should('equals', Cypress.config('baseUrl') + initialUrl);
  }
}

Cypress.Commands.add('login', (email: string, password: string, initialUrl = '/') => {
  const log = Cypress.log({
    displayName: 'B2C Login',
    message: [`🔐 Authenticating | ${email}`],
    autoEnd: false,
  });
  log.snapshot('before');

  cy.session([`b2c-${email}`, initialUrl], () => {
    cy.removeCookieBanner();
    cy.visit(initialUrl);

    loginViaB2C(email, password, initialUrl);
  });

  log.snapshot('after');
  log.end();
});

Cypress.Commands.add('removeCookieBanner', () => {
  Cypress.log({
    displayName: 'Cookie banner',
    message: 'Decline cookies',
  });
  cy.location('host').then(($host) => {
    cy.setCookie('CookieInformationConsent', encodeURIComponent('{"consents_approved":[]}'), {
      domain: $host,
      sameSite: 'lax',
      secure: true,
      hostOnly: true,
      path: '/',
    });
  });
});
