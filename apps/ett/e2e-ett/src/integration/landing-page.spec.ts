import * as landingPage from '../support/landing-page.po';

describe('Landing page', () => {
  beforeEach(() => {
    landingPage.navigateTo();
  });

  it('displays the EnergyOrigin logo', () => {
    landingPage.findLogo().should('exist');
  });
});
