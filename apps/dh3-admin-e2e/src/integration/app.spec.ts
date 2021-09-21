import { getGreeting } from '../support/app.po';

describe('dh3-admin', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    // Function helper example, see `../support/app.po.ts` file
    getGreeting().contains('THIS IS THE APP');
  });
});
