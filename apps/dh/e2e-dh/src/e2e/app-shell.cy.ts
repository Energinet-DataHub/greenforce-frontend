describe('Application shell', () => {
  it('should display welcome message', () => {
    cy.visit('/message-archive');
    cy.findByRole('heading', {
      name: new RegExp('Fremsøg forretningsbesked', 'i'),
    });
  });
});
