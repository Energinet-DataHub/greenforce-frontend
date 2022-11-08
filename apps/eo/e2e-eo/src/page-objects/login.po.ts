export default class LoginPage {
  findTitle = () => cy.get('h2[class="action-text"]');
  getCharlotteCSR = () =>
    cy.get('button').should('have.value', 'Charlotte CSR');
  getThomasTesla = () => cy.get('button').should('have.value', 'Thomas Tesla');
  getIvanIvaerksaetter = () =>
    cy.get('button').should('have.value', 'Ivan Iværksætter');
}
