//#region License
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
//#endregion
export class ReportsPo {
  private pageHeaderText = 'Reports';
  private requestButtonText = 'Request new report';
  private startRequestButtonText = 'Start';

  urlIsReportsPage = () => cy.url().should('contain', 'reports');

  // Visibility
  headerIsVisible = () =>
    cy.get('h2', { timeout: 10000 }).should('contain.text', this.pageHeaderText);

  requestButtonIsVisible = () =>
    cy.get('watt-button', { timeout: 10000 }).should('contain.text', this.requestButtonText);

  tableIsVisible = () => {
    cy.get('eo-reports-table', { timeout: 10000 }).should('exist');
  }

  clickRequestButton() {
    cy.get('watt-button', { timeout: 10000 }).contains(this.requestButtonText).click();
  }

  clickModalStartRequestButton() {
    cy.get('watt-button', { timeout: 10000 }).contains(this.startRequestButtonText).click();
  }

  toastIsVisible() {
    cy.get('watt-toast', { timeout: 10000 }).contains('Report request received');
  }
}
