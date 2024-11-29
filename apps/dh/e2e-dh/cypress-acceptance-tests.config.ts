import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    video: true,
    chromeWebSecurity: false,
    supportFile: `${__dirname}/src/support/e2e.ts`,
    specPattern: `${__dirname}/src/**/*.cy.ts`,
    excludeSpecPattern: `${__dirname}/src/e2e/b2c-healthchecks.cy.ts`,
    fixturesFolder: `${__dirname}/src/fixtures`,
  },
});
