const environments = [
  {
    name: 'dev_001',
    url: 'https://dev.datahub3.dk/',
  },
  {
    name: 'dev_002',
    url: 'https://dev002.datahub3.dk/',
  },
  {
    name: 'test_001',
    url: 'https://test.datahub3.dk/',
  },
  {
    name: 'test_002',
    url: 'https://test002.datahub3.dk/',
  },
  {
    name: 'preprod',
    url: 'https://preprod.datahub3.dk/',
  },
  {
    name: 'prod',
    url: 'https://datahub3.dk/',
  },
];

environments.forEach((env) => {
  it(`[B2C Healthcheck] ${env.name}`, { retries: 3 }, () => {
    // Should be able to reach the app
    cy.request(env.url).then((resp) => {
      expect(resp.status).to.eq(200);
    });

    cy.visit(env.url);

    cy.get('watt-button').click({ force: true });

    // Should have correct redirect_uri
    cy.location('href', { timeout: 10_000 }).should((url) => {
      expect(url).to.include(`redirect_uri=${encodeURIComponent(env.url)}`);
    });
  });
});
