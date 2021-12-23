import { chromium, FullConfig } from '@playwright/test';
import 'dotenv/config';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function globalSetup(_config: FullConfig) {
  console.log('Authenticating...');

  const browser = await chromium.launch();
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  await page.goto('https://localhost:4200/');
  await page.click('text=email');
  await page.type('input[id="email"]', process.env.DH_E2E_USERNAME);
  await page.click('[placeholder="Password"]');
  await page.fill('[placeholder="Password"]', process.env.DH_E2E_PASSWORD);
  await page.click('button:has-text("Sign in")');
  await page.waitForURL('https://localhost:4200');

  // Save signed-in state to 'playwright-storage-state.json'.
  await page.context().storageState({ path: 'apps/dh/e2e-dh/playwright-storage-state.json' });
  await browser.close();

  console.log('Authenticating completed...');
}

export default globalSetup;
