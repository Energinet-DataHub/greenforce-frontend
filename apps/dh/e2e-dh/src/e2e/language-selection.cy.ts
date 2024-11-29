describe('Language selection', () => {
  it(`toggle languages`, () => {
    // Given no language is selected
    // Then Danish translations are displayed
    cy.visit('/message-archive');
    cy.findByRole('heading', {
      name: new RegExp('Fremsøg forretningsbesked', 'i'),
    });

    // When English is selected
    // Then English translations are displayed
    cy.findByTestId('profileMenu').click({ force: true });
    cy.findByText('English').click({ force: true });

    cy.findByRole('heading', {
      name: new RegExp('Search in request and response messages', 'i'),
    });

    // Given English is selected
    // When Danish is selected
    // Then Danish translations are displayed
    cy.findByTestId('profileMenu').click({ force: true });
    cy.findByText('Dansk').click({ force: true });

    cy.findByRole('heading', {
      name: new RegExp('Fremsøg forretningsbesked', 'i'),
    });
  });
});
