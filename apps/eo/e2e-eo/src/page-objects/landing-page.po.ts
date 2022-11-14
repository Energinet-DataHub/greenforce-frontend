export class LandingPage {
  private path = '/';
  private pageHeaderText = 'Your emissions and renewables overview';

  headerIsVisible = () =>
    cy.get('h1').should('contain.text', this.pageHeaderText);
  navigateTo = () => cy.visit(this.path);
}
