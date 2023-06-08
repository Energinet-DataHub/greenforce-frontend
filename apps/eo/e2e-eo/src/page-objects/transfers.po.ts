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
export class TransfersPo {
  private pageHeaderText = 'Transfers';
  private cardHeaderText = 'Transfer Agreements';
  private transfersTable = '[data-testid="transfers-table"]';
  private newAgreementButton = '[data-testid="new-agreement-button"]';
  private downloadButton = '[data-testid="download-button"]';
  private paginator = '[data-testid="table-paginator"]';

  // Visibility
  headerIsVisible = () => cy.get('h2').should('contain.text', this.pageHeaderText);
  cardHeaderIsVisible = () => cy.get('h3').should('contain.text', this.cardHeaderText);
  urlIsTransfersPage = () => cy.url().should('contain', 'transfers');
  tableIsVisible = () => cy.get(this.transfersTable).should('be.visible');
  paginatorIsVisible = () => cy.get(this.paginator).should('be.visible');
  newAgreementButtonIsVisible = () => cy.get(this.newAgreementButton).should('be.visible');
  downloadButtonIsVisible = () => cy.get(this.downloadButton).should('be.visible');
}
