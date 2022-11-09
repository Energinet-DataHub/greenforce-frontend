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
import { App, DashboardPage, LandingPage, TermsPage } from '../page-objects';
import * as authApi from '../support/auth-api';

describe('Authentication', () => {
  it(`Given a commercial user
    When NemID authentication is successful
    Then they are redirected to the dashboard page`, () => {
    // Arrange
    authApi.allowExistingUserAuthentication();
    LandingPage.navigateTo();

    // Act
    LandingPage.findStartLink().click();

    // Assert
    DashboardPage.findTitle().should('be.visible');
  });

  it(`Given an authenticated commercial user
    When the "Log out" menu item is clicked
      And log out is successful
    Then they are redirected to the landing page`, () => {
    // Arrange
    authApi.allowExistingUserAuthentication();
    authApi.allowLogOut();
    LandingPage.navigateTo();
    LandingPage.findStartLink().click();
    // Wait for animation to finish
    App.findMenu().should('be.visible');

    // Act
    App.findLogOutMenuItem().click();

    // Assert
    cy.location('pathname').should('eq', LandingPage.path);
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
    LandingPage.navigateTo();

    // Act
    LandingPage.findStartLink().click();
    TermsPage.findAcceptCheckbox().click({ force: true });
    TermsPage.findAcceptButton().click({ force: true });

    // Assert
    DashboardPage.findTitle().should('exist');
  });

  it(`Given a commercial user using NemID
    When they successfully authenticate for the first time
    And they try to accept the user terms
    without having checked the checkbox
    Then they are not logged in`, () => {
    // Arrange
    authApi.allowFirstTimeAuthentication();
    authApi.allowGetTerms();
    LandingPage.navigateTo();

    // Act
    LandingPage.findStartLink().click();
    TermsPage.findAcceptButton().click();

    // Assert (Happy path -> Nothing happens - Asserting we are still on the terms page)
    TermsPage.findAcceptButton().should('exist');
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
    LandingPage.navigateTo();

    // Act
    LandingPage.findStartLink().click();
    TermsPage.findCancelButton().click();

    // Assert
    cy.location('pathname').should('eq', LandingPage.path);
  });
});
