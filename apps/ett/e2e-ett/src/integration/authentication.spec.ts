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
import * as dashboardPage from '../support/dashboard.po';
import * as landingPage from '../support/landing-page.po';

describe('Authentication', () => {
  it(`Given a commercial user
    When NemID authentication is successful
    Then they are redirected to the dashboard page`, () => {
    // Arrange
    cy.intercept(
      {
        hostname: 'localhost',
        method: 'GET',
        pathname: '/api/auth/oidc/login',
      },
      {
        next_url: '/dashboard?success=1',
      }
    );
    landingPage.navigateTo();

    // Act
    landingPage.findStartLink().click();

    // Assert
    dashboardPage.findTitle().should('exist');
  });

  it(`Given a commercial user using NemID
    When they successfully authenticate for the first time
      And they accept the user terms
    Then they are redirected to the dashboard page`, () => {
    // Arrange
    cy.intercept(
      {
        hostname: 'localhost',
        method: 'GET',
        pathname: '/api/auth/oidc/login',
      },
      {
        next_url: '/terms',
      }
    );
    cy.intercept(
      {
        hostname: 'localhost',
        method: 'POST',
        pathname: '/api/auth/terms_accept_url',
      },
      {
        next_url: '/dashboard?success=1',
      }
    );
    landingPage.navigateTo();

    // Act
    landingPage.findStartLink().click();
    termsPage.findAcceptCheckbox().click();
    termsPage.findAcceptButton().click();

    // Assert
    dashboardPage.findTitle().should('exist');
  });
});
