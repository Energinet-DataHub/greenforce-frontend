export class Shared {
  private onlyNecessaryButton = '[data-testid="button-only-necessary"]';
  private cookieBanner = 'eo-cookie-banner';
  private acceptAllButton = '[data-testid="button-accept-all"]';

  // Visibility
  cookieBannerIsVisible = () => cy.get(this.cookieBanner).should('be.visible');
  onlyNecessaryButtonIsVisible = () =>
    cy.get(this.onlyNecessaryButton).should('be.visible');
  acceptAllButtonIsVisible = () =>
    cy.get(this.acceptAllButton).should('be.visible');
  cookieBannerIsNotVisible = () =>
    cy.get(this.cookieBanner).should('not.exist');

  // Interaction
  clickOnlyNecessaryButton = () => cy.get(this.onlyNecessaryButton).click();
}
