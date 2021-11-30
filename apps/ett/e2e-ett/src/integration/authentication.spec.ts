import { AuthOidcLogoutResponse, GetProfileResponse } from '@energinet-datahub/ett/auth/data-access-api';

import * as appShell from '../support/app-shell.po';
import * as loginPage from '../support/login-page.po';

describe('Authentication', () => {
  describe('Given the user is authenticated', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/auth/profile', (request) => {
        const response: GetProfileResponse = {
          success: true,
          profile: {
            id: '1234',
            name: profileName,
          },
        };

        request.reply(response);
      }).as('getProfile');
      cy.intercept('GET', '/api/auth/logout', (request) => {
        const response: AuthOidcLogoutResponse = {
          success: true,
        };

        request.reply(response);
      }).as('logout');

      cy.visit('/dashboard');
    });

    const profileName = 'Jens Jensen';

    it('Then their profile name is displayed', () => {
      appShell.getProfileButton(profileName).should('exist');
    });

    it(`When the log out menu item is clicked
      Then the user is redirected to the login page`, () => {
      appShell.logOut();

      loginPage.getLoginProvidersLabel().should('exist');
    });

    it(`When the log out menu item is clicked
      Then a logout request is sent`, () => {
      appShell.logOut();

      cy.wait('@logout');
    });
  });
});
