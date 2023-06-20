import { add, format } from "date-fns";


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
  private cardHeaderText = 'Transfer agreements';
  private transfersTable = '[data-testid="transfers-table"]';
  private newAgreementButton = '[data-testid="new-agreement-button"]';
  private closeNewAgreementButton = '[data-testid="close-new-agreement-button"]';
  private createNewAgreementButton = '[data-testid="create-new-agreement-button"]';
  private newAgreementModal = '.watt-modal-panel';
  private newAgreementDateRangeEndInput = '.mat-end-date';
  private newAgreementDateRangeStartInput = '.mat-start-date';
  private newAgreementReceiverInput = '[data-testid="new-agreement-receiver-input"]';
  private downloadButton = '[data-testid="download-button"]';
  private paginator = '[data-testid="table-paginator"]';
  private testReceiverId = '11111111';

  private inFutureStart = add(new Date(), { years: 15 });
  private inFutureEnd = add(this.inFutureStart, { days: 1 });
  private testStartDate = format(this.inFutureStart, 'ddMMyyyy');
  private testEndDate = format(this.inFutureEnd, 'ddMMyyyy');

  // Visibility
  headerIsVisible = () => cy.get('h2').should('contain.text', this.pageHeaderText);
  cardHeaderIsVisible = () => cy.get('h3').should('contain.text', this.cardHeaderText);
  urlIsTransfersPage = () => cy.url().should('contain', 'transfers');
  tableIsVisible = () => cy.get(this.transfersTable).should('be.visible');
  paginatorIsVisible = () => cy.get(this.paginator).should('be.visible');
  newAgreementButtonIsVisible = () => cy.get(this.newAgreementButton).should('be.visible');
  newAgreementModalIsVisible = () => cy.get(this.newAgreementModal).should('be.visible');
  newAgreementModalIsNotOnScreen = () => cy.get(this.newAgreementModal).should('not.exist');
  downloadButtonIsVisible = () => cy.get(this.downloadButton).should('be.visible');
  newlyCreatedAgreementIsVisible = () =>
    cy.get(this.transfersTable).should('contain', this.testReceiverId);

  // Interaction
  clickNewAgreementButton() {
    cy.get(this.newAgreementButton).click();
  }

  enterDetailsForNewAgreement() {
    cy.get(this.newAgreementReceiverInput).type(this.testReceiverId);
    cy.get(this.newAgreementDateRangeStartInput).type(this.testStartDate);
    cy.get(this.newAgreementDateRangeEndInput).type(this.testEndDate);
  }

  clickCreateAgreementButton() {
    cy.get(this.createNewAgreementButton).click();
  }

  clickCloseNewAgreementModalButton() {
    cy.get(this.closeNewAgreementButton).click();
  }
}
