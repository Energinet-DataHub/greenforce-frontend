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
export class DashboardPo {
  private pageHeaderText = 'Dashboard';

  // Visibility
  headerIsVisible = () =>
    cy.get('h2').should('contain.text', this.pageHeaderText);
  urlIsDashboardPage = () => cy.url().should('contain', 'dashboard');
  pieChartIsVisible = () =>
    cy
      .get('eo-dashboard-chart-card')
      .should('contain.html', 'eo-origin-of-energy-pie-chart');
  exportDataCardIsVisible = () =>
    cy.get('eo-dashboard-get-data').should('be.visible');
  emissionCardIsVisible = () =>
    cy
      .get('eo-dashboard-emissions-card')
      .should('contain.html', 'eo-emissions-data');
  hourlyDeclarationIsVisible = () =>
    cy.get('eo-dashboard-hourly-declaration').should('be.visible');
  linkCollectionIsVisible = () =>
    cy.get('eo-dashboard-links').should('be.visible');
  linkCollectionHasAmount = (amount: number) =>
    cy.get('eo-dashboard-links a').should('have.length', amount);
}
