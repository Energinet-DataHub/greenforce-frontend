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
export const allowExistingUserAuthentication = () =>
  cy
    .intercept(
      {
        hostname: 'localhost',
        method: 'GET',
        pathname: '/api/auth/oidc/login',
      },
      {
        next_url: '/dashboard?success=1',
      }
    )
    .as('authOidcLogin');

export const allowFirstTimeAuthentication = () =>
  cy
    .intercept(
      {
        hostname: 'localhost',
        method: 'GET',
        pathname: '/api/auth/oidc/login',
      },
      {
        next_url:
          '/terms?state=secret&terms_url=/api/auth/terms&terms_accept_url=/api/auth/terms/accept',
      }
    )
    .as('authOidcLogin');

export const allowLogOut = () =>
  cy
    .intercept(
      {
        hostname: 'localhost',
        method: 'POST',
        pathname: '/api/auth/logout',
      },
      {
        success: true,
      }
    )
    .as('authLogout');

export const allowGetTerms = () =>
  cy.intercept(
    {
      hostname: 'localhost',
      method: 'GET',
      pathname: '/api/auth/terms',
    },
    {
      headline: 'headline',
      terms: '<h1>terms</h1>',
      version: '1.0',
    }
  );
