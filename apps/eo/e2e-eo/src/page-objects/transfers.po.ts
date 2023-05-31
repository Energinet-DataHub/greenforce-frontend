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
