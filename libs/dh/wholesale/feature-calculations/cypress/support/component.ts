// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.ts using ES2015 syntax:
import './commands';

declare const window: {
  cypressMockServiceWorkerIntercept: Promise<unknown> | undefined;
} & Window;

window.cypressMockServiceWorkerIntercept = new Promise((resolve) => {
  before(() => {
    /**
     * We need to intercept the mockServiceWorker.js file and serve it like this,
     * because the script is not allowed to be behind a redirect
     */
    cy.request('/__cypress/src/mockServiceWorker.js').then((res) => {
      cy.intercept('/mockServiceWorker.js', {
        headers: { 'content-type': 'text/javascript' },
        body: res.body,
      }).then(resolve);
    });
  });
});

// Intercept assets
beforeEach(() => {
  cy.intercept('/assets/i18n/da.json', { hostname: 'localhost' }, (req) => {
    req.redirect('/__cypress/src/assets/i18n/da.json');
  });

  cy.intercept('/assets/watt/icons/power.svg', { hostname: 'localhost' }, (req) => {
    req.redirect('/__cypress/src/assets/watt/icons/power.svg');
  });
});
