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
export class ConnectionsPo {
  private pageHeaderText = 'Connections';
  private cardHeaderText = 'Results';
  private newInvitationButton = '[data-testid="new-invitation-button"]';
  private invitationLink = '[data-testid="invitation-link"]';
  private copyInvitationLinkButton = '[data-testid="copy-invitation-link-button"]';
  private connectionInvitationId = 'MOCKED-CONNECTION-INVITATION-ID';
  private mockedInvitationLink =
    'http://localhost:4200/connections?accept-invitation=' + this.connectionInvitationId;
  private removeConnectionButton = '[data-testid="remove-connection-button"]';
  private confirmRemovalButton = '[data-testid="confirm-removal-button"]';

  // Visibility
  headerIsVisible = () => cy.get('h2').should('contain.text', this.pageHeaderText);
  cardHeaderIsVisible = () => cy.get('h3').should('contain.text', this.cardHeaderText);
  urlIsTransfersPage = () => cy.url().should('contain', 'connections');
  invitationLinkIsVisible = () => cy.get(this.invitationLink).should('be.visible');

  // Interaction
  clickNewInvitationButton() {
    cy.intercept('POST', 'https://demo.energioprindelse.dk/api/connection-invitations', {
      statusCode: 200,
      body: { connectionInvitationId: this.connectionInvitationId },
    });

    cy.get(this.newInvitationButton).click();
  }

  clickRemoveConnectionButton() {
    cy.intercept('DELETE', 'https://demo.energioprindelse.dk/api/connections/ID1', {
      statusCode: 200,
    });
    cy.get(this.removeConnectionButton).first().click();
  }

  clickConfirmRemoveConnectionButton() {
    cy.get(this.confirmRemovalButton).click();
  }

  clickCopyInitiationLinkButton() {
    cy.get(this.invitationLink).should('have.value', this.mockedInvitationLink);
    cy.get(this.copyInvitationLinkButton).click();

    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'readText').resolves(this.mockedInvitationLink);
      cy.get(this.copyInvitationLinkButton).click();

      cy.wrap(win.navigator.clipboard.readText()).should('equal', this.mockedInvitationLink);
    });
  }
}
