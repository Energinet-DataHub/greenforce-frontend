const environments = [
  {
    name: 'U001',
    url: 'https://jolly-sand-03f839703.azurestaticapps.net/',
  },
  {
    name: 'U002',
    url: 'https://wonderful-field-057109603.1.azurestaticapps.net/',
  },
  {
    name: 'T001',
    url: 'https://ashy-forest-09ecf8003.2.azurestaticapps.net/',
  },
];

environments.forEach((env) => {
  it(`[B2C Healthcheck] ${env.name}`, () => {
    // Should be able to reach the app
    cy.request(env.url).then((resp) => {
      expect(resp.status).to.eq(200);
    });

    // Should have correct redirect_uri
    cy.visit(env.url);
    cy.location('href').should((url) => {
      expect(url).to.include(`redirect_uri=${encodeURIComponent(env.url)}`);
    });
  });
});
