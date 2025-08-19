export class LanguageSwitcherPo {
  open() {
    // The component opens on host click via @HostListener('click')
    cy.get('eo-language-switcher', { timeout: 10000 }).should('be.visible').click({ force: true });
  }

  modal() {
    // Inline modal renders content into the DOM; .watt-modal-content used in other tests
    return cy.get('.watt-modal-content', { timeout: 10000 });
  }

  dropdown() {
    return this.modal().find('watt-dropdown', { timeout: 10000 });
  }
}
