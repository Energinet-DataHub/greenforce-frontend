export class LoginPo {
  private thomas = '[value="Thomas Tesla"]';
  private charlotte = '[value="Charlotte CSR"]';
  private ivan = '[value="Ivan Iværksætter"]';

  // Interaction
  clickIvanLogin = () => cy.get(this.ivan).click();
  clickCharlotteLogin = () => cy.get(this.charlotte).click();
  clickThomasLogin = () => cy.get(this.thomas).click();
}
