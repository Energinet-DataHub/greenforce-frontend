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
  private newAgreementModal = '.watt-modal-panel';
  private newAgreementReceiverInput = '[data-testid="new-agreement-receiver-input"]';
  private paginator = '[data-testid="table-paginator"]';
  private testReceiverId = '11111111';
  private testStartDate = '12052023';

  // Visibility
  headerIsVisible = () => cy.get('h2').should('contain.text', this.pageHeaderText);
  cardHeaderIsVisible = () => cy.get('h3').should('contain.text', this.cardHeaderText);
  urlIsTransfersPage = () => cy.url().should('contain', 'transfers');
  tableIsVisible = () => cy.get(this.transfersTable).should('be.visible');
  paginatorIsVisible = () => cy.get(this.paginator).should('be.visible');
  newAgreementButtonIsVisible = () => cy.get(this.newAgreementButton).should('be.visible');
  newAgreementModalIsVisible = () => cy.get(this.newAgreementModal).should('be.visible');
  newAgreementModalIsNotOnScreen = () => cy.get(this.newAgreementModal).should('not.exist');
  newlyCreatedAgreementIsVisible = () =>
    cy.get(this.transfersTable).should('contain', this.testReceiverId);

  // Interaction
  clickNewAgreementButton() {
    cy.get(this.newAgreementButton).click();
  }

  enterReceiverDetailsForNewAgreement() {
    cy.get(this.newAgreementReceiverInput).type(this.testReceiverId);
  }

  clickTimeframeButton() {
    cy.get('div.mat-step-label').contains('Timeframe').click();
  }

  clickInvitationButton() {
    cy.get('div.mat-step-label').contains('Invitation').click();
  }

  copyLinkToTransferAgreementProposal() {
    cy.get('button').contains('Copy & close').click();
  }

  enterDetailsForNewAgreement() {
    cy.get('input[matinput][aria-label="date-input"] + input[class="mask-input"]').type(
      this.testStartDate
    );
  }

  clickCloseNewAgreementModalButton() {
    cy.get('button').contains('Copy & close').click();
  }
}
