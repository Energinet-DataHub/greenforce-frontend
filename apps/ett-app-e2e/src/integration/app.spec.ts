import { getTitle } from '../support/app.po';

describe('Energy Track and Trace app', () => {
  beforeEach(() => cy.visit('/'));

  it('displays a title', () => {
    getTitle().contains('Energy Track and Trace');
  });
});
