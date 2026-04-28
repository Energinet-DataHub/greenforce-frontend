//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion
import { test as setup, expect } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const STORAGE_STATE = path.resolve(__dirname, '..', '..', '.auth', 'user.json');
const SESSION_STORAGE_STATE = path.resolve(__dirname, '..', '..', '.auth', 'session.json');

setup('authenticate', async ({ page, context, baseURL }) => {
  const email = process.env['DH_E2E_USERNAME'] ?? '';
  const password = process.env['DH_E2E_PASSWORD'] ?? '';

  if (!email || !password) {
    throw new Error(
      'DH_E2E_USERNAME and DH_E2E_PASSWORD environment variables must be set for the auth setup project'
    );
  }

  // Decline cookie banner ahead of navigation so it does not intercept clicks. Derive the
  // domain from baseURL so the cookie applies whether tests run against localhost (mocked
  // dev server) or a deployed env (acceptance tests against dev_xxx / preprod).
  const cookieDomain = baseURL ? new URL(baseURL).hostname : 'localhost';
  await context.addCookies([
    {
      name: 'CookieInformationConsent',
      value: encodeURIComponent('{"consents_approved":[]}'),
      domain: cookieDomain,
      path: '/',
      sameSite: 'Lax',
      secure: true,
    },
  ]);

  await page.goto('/');
  await page.getByRole('button', { name: /login.*(brugernavn|username)/i }).click();

  // B2C exposes accessible labels. Scope to textbox role so the form's own
  // aria-label ("Sign in with your email address") does not match the email regex.
  await page.getByRole('textbox', { name: /email address|mailadresse/i }).fill(email);
  await page.getByRole('textbox', { name: /password|adgangskode/i }).fill(password);
  await page.getByRole('button', { name: /log på|sign in/i }).click();

  // Login is complete when the authenticated shell renders. The profile menu only exists
  // on authenticated pages, so this works regardless of the user's default landing route.
  await expect(page.getByTestId('profileMenu')).toBeVisible({ timeout: 30_000 });

  fs.mkdirSync(path.dirname(STORAGE_STATE), { recursive: true });
  await page.context().storageState({ path: STORAGE_STATE });

  // MSAL caches tokens in sessionStorage (see dh-b2c-config.ts). Playwright's storageState
  // only serializes cookies + localStorage, so we have to capture sessionStorage ourselves
  // and replay it via fixtures/dh-test.ts.
  // Wait until MSAL has actually written its keys before reading; otherwise page.evaluate can
  // race with a follow-up navigation triggered by MSAL's token refresh and throw
  // "Execution context was destroyed".
  await page.waitForFunction(
    () => {
      for (let i = 0; i < window.sessionStorage.length; i++) {
        if (window.sessionStorage.key(i)?.startsWith('msal.')) {
          return true;
        }
      }
      return false;
    },
    null,
    { timeout: 30_000 }
  );

  const serialized = await page.evaluate(() => {
    const entries: Record<string, string> = {};
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const key = window.sessionStorage.key(i);
      if (key !== null) {
        entries[key] = window.sessionStorage.getItem(key) ?? '';
      }
    }
    return JSON.stringify(entries);
  });
  fs.writeFileSync(SESSION_STORAGE_STATE, serialized);
});
