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
import { render, screen } from '@testing-library/angular';
import { EoFooterScam, EoFooterComponent } from './eo-footer.component';

describe(EoFooterComponent.name, () => {
  const findEnerginetLogo = () =>
    screen.findByRole('img', { name: 'Energinet' });
  const findPrivacyLink = () =>
    screen.findByRole('link', { name: /privacypolicy/i });
  const findAccessibilityLink = () =>
    screen.findByRole('link', { name: /accessibility/i });
  const findPhoneLink = () => screen.findByRole('link', { name: /phone/i });
  const findEmailLink = () => screen.findByRole('link', { name: /email/i });

  beforeEach(async () => {
    await render(EoFooterComponent, {
      imports: [EoFooterScam],
    });
  });

  it('displays the Energinet logo', async () => {
    expect(await findEnerginetLogo()).toBeInTheDocument();
  });
  it('displays a privacy policy link', async () => {
    expect(await findPrivacyLink()).toBeInTheDocument();
  });
  it('displays a accessibility statement link', async () => {
    expect(await findAccessibilityLink()).toBeInTheDocument();
  });

  it('displays a telephone link', async () => {
    expect((await findPhoneLink()).getAttribute('href')).toMatch(/^tel:/);
  });

  it('displays an e-mail link', async () => {
    expect((await findEmailLink()).getAttribute('href')).toMatch(/^mailto:/);
  });
});

describe(`${EoFooterScam.name} - Component API, Content projection`, () => {
  it('Inserts content into ng-content', async () => {
    await render(`<eo-footer><p>test</p></eo-footer>`, {
      imports: [EoFooterScam],
    });
    expect(await screen.findByText('test')).toBeInTheDocument();
  });
});
