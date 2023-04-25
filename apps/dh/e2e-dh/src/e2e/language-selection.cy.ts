// Appearantly there are some issues with `paths` so we need to use absolute paths for now.
import {
  da as daTranslations,
  en as enTranslations,
} from '@energinet-datahub/dh/globalization/assets-localization';

describe('Language selection', () => {
  it(`toggle languages`, () => {
    // Given no language is selected
    // Then Danish translations are displayed
    cy.visit('/metering-point/search');
    cy.findByRole('heading', {
      name: new RegExp(daTranslations.meteringPoint.search.title, 'i')
    });

    // When English is selected
    // Then English translations are displayed
    cy.findByText('EN').click();
    cy.findByRole('heading', {
      name: new RegExp(enTranslations.meteringPoint.search.title, 'i')
    });

    // Given English is selected
    // When Danish is selected
    // Then Danish translations are displayed
    cy.findByText('DA').click();
    cy.findByRole('heading', {
      name: new RegExp(daTranslations.meteringPoint.search.title, 'i')
    });
  });
});
