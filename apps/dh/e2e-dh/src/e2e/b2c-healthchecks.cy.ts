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
const environments = [
  {
    name: 'dev001',
    url: 'https://nice-meadow-03a161503.3.azurestaticapps.net/',
  },
  {
    name: 'dev002',
    url: 'https://lively-pond-06cbcb903.3.azurestaticapps.net/',
  },
  {
    name: 'test001',
    url: 'https://green-beach-024d44703.3.azurestaticapps.net/',
  },
  {
    name: 'preprod',
    url: 'https://red-meadow-02d1f9403.3.azurestaticapps.net/',
  },
  {
    name: 'sandbox002',
    url: 'https://happy-desert-06b3ac903.4.azurestaticapps.net/',
  },
];

environments.forEach((env) => {
  it(`[B2C Healthcheck] ${env.name}`, { retries: 3 }, () => {
    // Should be able to reach the app
    cy.request(env.url).then((resp) => {
      expect(resp.status).to.eq(200);
    });

    // Should have correct redirect_uri
    cy.visit(env.url);
    cy.location('href', { timeout: 10000 }).should((url) => {
      expect(url).to.include(`redirect_uri=${encodeURIComponent(env.url)}`);
    });
  });
});
