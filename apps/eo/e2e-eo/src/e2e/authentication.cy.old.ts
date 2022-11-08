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
import * as appShell from '../page-objects/app.po';
import * as authApi from '../support/auth-api';
import * as dashboardPage from '../page-objects/dashboard.po';
import * as landingPage from '../page-objects/landing-page.po';
import * as termsPage from '../page-objects/terms.po';

describe('Authentication', () => {
  it(`Given a commercial user
    When NemID authentication is successful
    Then they are redirected to the dashboard page`, () => {
    // Arrange
    authApi.allowExistingUserAuthentication();
    landingPage.navigateTo();

    // Act
    landingPage.findStartLink().click();

    // Assert
    dashboardPage.findTitle().should('be.visible');
  });

  it(`Given an authenticated commercial user
    When the "Log out" menu item is clicked
      And log out is successful
    Then they are redirected to the landing page`, () => {
    // Arrange
    authApi.allowExistingUserAuthentication();
    authApi.allowLogOut();
    landingPage.navigateTo();
    landingPage.findStartLink().click();
    // Wait for animation to finish
    appShell.findMenu().should('be.visible');

    // Act
    appShell.findLogOutMenuItem().click();

    // Assert
    cy.location('pathname').should('eq', landingPage.path);
  });

  it(`Given a commercial user using NemID
    When they successfully authenticate for the first time
      And they accept the user terms
    Then they are redirected to the dashboard page`, () => {
    // Arrange
    authApi.allowFirstTimeAuthentication();
    authApi.allowGetTerms();

    cy.intercept(
      {
        hostname: 'localhost',
        method: 'POST',
        pathname: '/api/auth/terms/accept',
      },
      {
        next_url: '/dashboard?success=1',
      }
    ).as('authPostTerms');
    landingPage.navigateTo();

    // Act
    landingPage.findStartLink().click();
    termsPage.findAcceptCheckbox().click({ force: true });
    termsPage.findAcceptButton().click({ force: true });

    // Assert
    dashboardPage.findTitle().should('exist');
  });

  it(`Given a commercial user using NemID
    When they successfully authenticate for the first time
    And they try to accept the user terms
    without having checked the checkbox
    Then they are not logged in`, () => {
    // Arrange
    authApi.allowFirstTimeAuthentication();
    authApi.allowGetTerms();
    landingPage.navigateTo();

    // Act
    landingPage.findStartLink().click();
    termsPage.findAcceptButton().click();

    // Assert (Happy path -> Nothing happens - Asserting we are still on the terms page)
    termsPage.findAcceptButton().should('exist');
  });

  // Next: Test where the user logs out = hits the "Cancel" button
  it(`Given a commercial user using NemID
    When they successfully authenticate for the first time
      And they do not accept the user terms
    Then they are loged out and redirected to the landing page`, () => {
    // Arrange
    authApi.allowFirstTimeAuthentication();
    authApi.allowLogOut();
    authApi.allowGetTerms();
    landingPage.navigateTo();

    // Act
    landingPage.findStartLink().click();
    termsPage.findCancelButton().click();

    // Assert
    cy.location('pathname').should('eq', landingPage.path);
  });
});
