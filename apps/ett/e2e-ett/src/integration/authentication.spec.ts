/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import {
  AuthLogoutResponse,
  AuthProfileResponse,
} from '@energinet-datahub/ett/auth/data-access-api';

import * as appShell from '../support/app-shell.po';
import * as loginPage from '../support/login-page.po';

describe('Authentication', () => {
  describe('Given the user is authenticated', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/auth/profile', (request) => {
        const response: AuthProfileResponse = {
          success: true,
          profile: {
            id: '1234',
            name: profileName,
          },
        };

        request.reply(response);
      }).as('getProfile');
      cy.intercept('GET', '/api/auth/logout', (request) => {
        const response: AuthLogoutResponse = {
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

      loginPage.isActivePage();
    });

    it(`When the log out menu item is clicked
      Then a logout request is sent`, () => {
      appShell.logOut();

      cy.wait('@logout');
    });
  });

  // Skipped until error handling is added to the frontend
  describe.skip('Given user authentication fails', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/auth/profile', (request) => {
        const response: AuthProfileResponse = {
          success: false,
        };

        request.reply(response);
      }).as('getProfile');

      cy.visit('/dashboard');
    });

    it('Then the user is redirected to the login page', () => {
      loginPage.isActivePage();
    });
  });
});
