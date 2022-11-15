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
