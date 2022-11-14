export class Footer {
  private logo = 'img[alt="Energinet"].logo';
  private privacyPolicy = 'a[aria-label="privacypolicy"]';
  private accessibility = 'a[aria-label="accessibility"]';
  private phone = 'a[aria-label="phone"]';
  private email = 'a[aria-label="email"]';
  private footer = () => cy.get('eo-footer');

  // Visibility
  isVisible = () => this.footer().should('be.visible');
  hasLogo = () => this.footer().get(this.logo).should('be.visible');
  hasPrivacyPolicyLink = () =>
    this.footer().get(this.privacyPolicy).should('be.visible');
  hasAccessibilityLink = () =>
    this.footer().get(this.accessibility).should('be.visible');
  hasPhoneLink = () => this.footer().get(this.phone).should('be.visible');
  hasEmailLink = () => this.footer().get(this.email).should('be.visible');
}
