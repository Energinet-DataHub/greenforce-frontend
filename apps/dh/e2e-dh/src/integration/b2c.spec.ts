import { test, expect } from '@playwright/test';

const environments = [
  {
    name: 'U001',
    url: 'https://jolly-sand-03f839703.azurestaticapps.net',
  },
  {
    name: 'U002',
    url: 'https://ambitious-coast-027d0aa03.azurestaticapps.net',
  },
  {
    name: 'T001',
    url: 'https://lively-river-0f22ad403.azurestaticapps.net',
  },
  {
    name: 'B001',
    url: 'https://blue-rock-05b7e5e03.azurestaticapps.net',
  },
  {
    name: 'B002',
    url: 'https://purple-forest-07e41fb03.azurestaticapps.net',
  },
];

environments.forEach((env) => {
  test(`${env.name} should have correct redirect_uri, after redirected to B2C login page @b2c`, async ({
    page,
  }) => {
    await page.goto(env.url);
    await page.waitForNavigation();
    expect(page.url()).toContain(`redirect_uri=${encodeURIComponent(env.url)}`);
  });
});
