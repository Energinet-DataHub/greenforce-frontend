module.exports = {
  e2e: {
    // videosFolder: 'cypress/videos',
    // screenshotsFolder: 'cypress/screenshots',
    video: true,
    chromeWebSecurity: false,
    supportFile: `${__dirname}/src/support/e2e.ts`,
    specPattern: `${__dirname}/src/**/*.cy.ts`,
    fixturesFolder: `${__dirname}/src/fixtures`,
    excludeSpecPattern: `${__dirname}/src/e2e/b2c-healthchecks.cy.ts`,
  },
}
