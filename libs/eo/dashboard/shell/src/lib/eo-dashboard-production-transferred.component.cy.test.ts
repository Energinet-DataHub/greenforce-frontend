it('should compare two texts', () => {
  const expectedText = 'Hello, World!';
  const actualText = 'Hello, World!';

  cy.get('.element-selector')
    .should('have.text', expectedText)
    .then((element) => {
      const text = element.text();
      expect(text).to.equal(actualText);
    });
});
