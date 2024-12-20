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
import '@testing-library/cypress/add-commands';

function loginViaB2C(email: string, password: string) {
  cy.removeCookieBanner();
  cy.visit('/login', undefined, true);
  cy.get('watt-button').click();

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

  // Ensure Microsoft has redirected us back to the sample app with our logged in user.
  cy.url().should('equals', Cypress.config('baseUrl') + '/message-archive');
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session(
    `b2c-${email}`,
    () => {
      const log = Cypress.log({
        displayName: 'B2C Login',
        message: [`🔐 Authenticating | ${email}`],
        autoEnd: false,
      });

      console.log('base url', Cypress.config('baseUrl'));

      log.snapshot('before');

      loginViaB2C(email, password);

      log.snapshot('after');
      log.end();
    },
    {
      validate: () => {
        cy.visit('/message-archive');
        cy.findByRole('heading', {
          name: new RegExp('Fremsøg forretningsbesked', 'i'),
          timeout: 10000,
        });
      },
    }
  );
});

Cypress.Commands.add('removeCookieBanner', () => {
  Cypress.log({
    displayName: 'Cookie banner',
    message: 'Decline cookies',
  });
  cy.location('host', { log: false }).then(($host) => {
    cy.setCookie('CookieInformationConsent', encodeURIComponent('{"consents_approved":[]}'), {
      domain: $host,
      sameSite: 'lax',
      secure: true,
      hostOnly: true,
      path: '/',
      log: false,
    });
  });
});

Cypress.Commands.overwrite('visit', (originalFn, url, options, skipLoggedInCheck?:boolean) => {
  cy.intercept('POST', 'bff/graphql?GetSelectionActors', { log: false }).as('getSelectionActors');
  // @ts-expect-error - no error
  originalFn(url, options);
  if (skipLoggedInCheck !== true){
    cy.get('.selected-organization-name-label', { log: false }).then(() => {
      cy.window({ log: false })
        .its('localStorage', { log: false })
        .invoke({ log: false }, 'getItem', 'actorStorage.selectedActorId')
        .should($ls => {
          if (!$ls.length) throw new Error("'actorStorage.selectedActorId' should exist in localStorage")
        })
      cy.wait('@getSelectionActors', { log: false });
    });
  }
});

Cypress.Commands.add('visitActors', () => {
  Cypress.log({
    displayName: 'visit',
    message: 'Aktører',
  })
  cy.findByRole('link', { name: /Aktører/, log: false }).click({ log: false });
  cy.findByRole('heading', { level: 2, name: /Aktører/, log: false});
});
