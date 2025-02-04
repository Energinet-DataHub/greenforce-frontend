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
export class TransfersPo {
  private pageHeaderText = 'Transfers';
  private ownTransferAgreementCardHeaderText = 'Own transfer agreements';
  private transferAgreementsFromPOACardHeaderText = 'Agreements through power of attorney';
  private ownTransfersTable = '[data-testid="own-transfer-agreements-table"]';
  private transfersFromPOATable = '[data-testid="transfer-agreements-from-poa-table"]';
  private ownTransferAgreementsExpandableCard = '[data-testid="own-transfer-agreements-card"]';
  private transferAgreementsFromPOAExpandableCard =
    '[data-testid="transfer-agreements-from-poa-card"]';
  private newAgreementButton = '[data-testid="new-agreement-button"]';
  private newAgreementModal = '.watt-modal-panel';
  private newAgreementReceiverInput = '[data-testid="new-agreement-receiver-input"]';
  private newAgreementSenderInputLabel = 'Sender';
  private matchRecipientsConsumption = 'Match recipients consumption';
  private createAgreementButton = 'Create agreement';
  private paginator = '[data-testid="table-paginator"]';
  private testReceiverId = '11223344';
  private testSenderId = '77777777';
  private today = new Date();
  private testStartDate = `${this.today.getDate()}${this.today.getMonth()}${this.today.getFullYear()}`;

  // Visibility
  headerIsVisible = () =>
    cy.get('h2', { timeout: 10000 }).should('contain.text', this.pageHeaderText);
  ownTransferAgreementCardHeaderIsVisible = () =>
    cy
      .get('watt-expandable-card-title')
      .should('contain.text', this.ownTransferAgreementCardHeaderText);
  transferAgreementsFromPOACardHeaderIsVisible = () =>
    cy
      .get('watt-expandable-card-title')
      .should('contain.text', this.transferAgreementsFromPOACardHeaderText);
  urlIsTransfersPage = () => cy.url().should('contain', 'transfers');
  ownTransferAgreementTableIsVisible = () => cy.get(this.ownTransfersTable).should('be.visible');
  transferAgreementsFromPOATableIsNotVisible = () =>
    cy.get(this.transfersFromPOATable).should('not.be.visible');
  transferAgreementsFromPOATableIsVisible = () =>
    cy.get(this.transfersFromPOATable).should('be.visible');
  ownTransferAgreementTablePaginatorIsVisible = () => cy.get(this.paginator).should('be.visible');
  transferAgreementsFromPOATablePaginatorIsVisible = () =>
    cy.get(this.paginator).should('be.visible');
  ownTransferAgreementsExpandableCardIsVisible = () =>
    cy.get(this.ownTransferAgreementsExpandableCard).should('be.visible');
  transferAgreementsFromPOAExpandableCardIsVisible = () =>
    cy.get(this.transferAgreementsFromPOAExpandableCard).should('be.visible');
  newAgreementButtonIsVisible = () => cy.get(this.newAgreementButton).should('be.visible');
  newAgreementModalIsVisible = () => cy.get(this.newAgreementModal).should('be.visible');
  newAgreementModalIsNotOnScreen = () => cy.get(this.newAgreementModal).should('not.exist');

  // Interaction

  clickNewAgreementButton() {
    cy.get(this.newAgreementButton).click();
  }

  clickSenderField() {
    cy.get('watt-field').contains(this.newAgreementSenderInputLabel).click();
  }

  clickReceiverField() {
    cy.get(this.newAgreementReceiverInput).click();
  }

  clickTimeframeButton() {
    cy.get('div.mat-step-label').contains('Timeframe').click();
  }

  clickVolumeButton() {
    cy.get('div.mat-step-label').contains('Volume').click();
  }

  clickSummaryButton() {
    cy.get('div.mat-step-label').contains('Summary').click();
  }

  copyLinkToTransferAgreementProposal() {
    cy.get('button').contains('Copy & close').click();
  }

  enterDetailsForNewAgreement() {
    cy.get('watt-datepicker, input[class="mask-input"]').type(this.testStartDate);
  }

  clickCloseNewAgreementModalButton() {
    cy.get('button').contains('Copy & close').click();
  }

  selectSender() {
    cy.get('mat-option').contains(this.testSenderId).click();
  }

  selectReceiver() {
    cy.get('mat-option').contains(this.testReceiverId).click();
  }

  clickMatchReceiverConsumption() {
    cy.get('label.watt-text-m').contains(this.matchRecipientsConsumption).click();
  }

  clickCreateAgreementButton() {
    cy.get('button').contains(this.createAgreementButton).click();
  }

  clickTransferAgreementsFromPOAExpandableCard() {
    cy.get('watt-expandable-card').contains(this.transferAgreementsFromPOACardHeaderText).click();
  }
}
