// Appearantly there are some issues with `paths` so we need to use absolute paths for now.
import { da as daTranslations } from '@energinet-datahub/dh/globalization/assets-localization';

describe('Application shell', () => {
  it('should display welcome message', () => {
    cy.visit('/metering-point/search');
    cy.findByRole('heading', {
      name: new RegExp(daTranslations.meteringPoint.search.title, 'i')
    });
  });
});
