import '@testing-library/cypress/add-commands';

function loginViaB2C(email: string, password: string) {
  cy.removeCookieBanner();
  cy.visit('/');

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
        cy.visit('/');
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
