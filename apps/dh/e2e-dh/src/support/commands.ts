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

function getOrigin(url: string) {
  return new URL(url).origin;
}

function requireEnvValue(name: string, value: string | undefined) {
  if (value) {
    return value;
  }

  throw new Error(
    `Missing Cypress environment variable ${name}. Set it via apps/dh/e2e-dh/cypress.env.json or the CYPRESS_${name} shell environment variable.`
  );
}

function enterCredentials(email: string, password: string) {
  cy.get('#email').type(email, {
    log: false,
  });
  cy.get('#password').type(password, {
    log: false,
  });
  cy.get('#next').click();
}

function loginViaB2C(
  email: string,
  password: string,
  initialUrl: string,
  configuredB2COrigin: string | null
) {
  cy.findByRole('button').click();

  cy.location('origin', { timeout: 20_000 }).then((origin) => {
    if (origin !== Cypress.config('baseUrl')) {
      if (configuredB2COrigin) {
        expect(origin).to.equal(configuredB2COrigin);
      }

      cy.origin(
        origin,
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

      return;
    }

    enterCredentials(email, password);
  });

  // Ensure Microsoft has redirected us back to the app with our logged in user.
  if (initialUrl === '/') {
    // User might be redirected to either metering-point/search or message-archive based on permissions
    cy.url().should('satisfy', (url: string) => {
      return (
        url === Cypress.config('baseUrl') + '/metering-point/search' ||
        url === Cypress.config('baseUrl') + '/message-archive'
      );
    });
  } else {
    cy.url().should('equals', Cypress.config('baseUrl') + initialUrl);
  }
}

Cypress.Commands.add(
  'login',
  (email: string | undefined, password: string | undefined, initialUrl = '/') => {
    const requiredEmail = requireEnvValue('DH_E2E_USERNAME', email);
    const requiredPassword = requireEnvValue('DH_E2E_PASSWORD', password);

    const log = Cypress.log({
      displayName: 'B2C Login',
      message: [`🔐 Authenticating | ${requiredEmail}`],
      autoEnd: false,
    });
    log.snapshot('before');

    cy.session([`b2c-${requiredEmail}`, initialUrl], () => {
      cy.env(['DH_E2E_B2C_URL']).then(({ DH_E2E_B2C_URL }) => {
        const configuredB2COrigin = DH_E2E_B2C_URL ? getOrigin(DH_E2E_B2C_URL) : null;

        cy.removeCookieBanner();
        cy.visit(initialUrl);

        loginViaB2C(requiredEmail, requiredPassword, initialUrl, configuredB2COrigin);
      });
    });

    log.snapshot('after');
    log.end();
  }
);

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
