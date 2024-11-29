export class DashboardPo {
  private pageHeaderText = 'Dashboard';

  // Visibility
  headerIsVisible = () =>
    cy.get('h2', { timeout: 10000 }).should('contain.text', this.pageHeaderText);
  urlIsDashboardPage = () => cy.url().should('contain', 'dashboard');
  greenConsumptionIsVisible = () => cy.get('eo-dashboard-consumption').should('be.visible');
}
