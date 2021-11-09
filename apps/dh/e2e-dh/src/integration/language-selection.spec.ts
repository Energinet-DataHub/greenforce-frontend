import { DisplayLanguage } from '@energinet-datahub/dh/globalization/domain';

import * as appShell from '../support/app-shell.po';

export const getLanguagePicker = (language: DisplayLanguage) =>
  cy.findByRole('button', {
    name: new RegExp('\\s*' + language.toUpperCase() + '\\s*'),
  });

describe('Language selection', () => {
  beforeEach(() => cy.visit('/'));

  it(`Given no language is selected
    Then Danish translations are displayed`, () => {
    appShell.getTitle().should('contain', 'DataHub [DA]');
  });

  it(`When English is selected
    Then English translations are displayed`, () => {
    getLanguagePicker(DisplayLanguage.English).click();

    appShell.getTitle().should('contain', 'DataHub [EN]');
  });

  it(`Given English is selected
    When Danish is selected
    Then Danish translations are displayed`, () => {
    getLanguagePicker(DisplayLanguage.English).click();

    getLanguagePicker(DisplayLanguage.Danish).click();

    appShell.getTitle().should('contain', 'DataHub [DA]');
  });
});
