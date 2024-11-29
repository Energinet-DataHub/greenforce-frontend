export class SharedPO {
  private navListItem = 'watt-nav-list-item';
  private topbarActions = '.watt-toolbar button';

  // Interaction
  clickLogoutMenuItem = () => {
    cy.get('eo-account-menu').click();
    cy.get('watt-button').contains('Logout').click({ force: true });
  };
  clickTransfersMenuItem = () =>
    cy.get(this.navListItem, { timeout: 10000 }).contains('Transfers').click();
  clickConnectionsMenuItem = () =>
    cy.get(this.navListItem, { timeout: 10000 }).contains('Connections').click();
}
