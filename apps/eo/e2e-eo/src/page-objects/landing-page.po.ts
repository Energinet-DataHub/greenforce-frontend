export class LandingPage {
  private path = '/';
  private pageHeaderText = 'Your emissions and renewables overview';

  // Visibility
  headerIsVisible = () =>
    cy.get('h1').should('contain.text', this.pageHeaderText);
  startButtonsVisible = (amount: number) =>
    cy.get('eo-landing-page-login-button').should('have.length', amount);

  // Interaction
  navigateTo = () => cy.visit(this.path);
}
