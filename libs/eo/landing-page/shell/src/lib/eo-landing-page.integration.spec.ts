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
import {
  SpectacularAppComponent,
  SpectacularFeatureTestingModule,
} from '@ngworker/spectacular';
import { render, screen } from '@testing-library/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EoLandingPageShellModule } from './eo-landing-page-shell.module';

describe('EnergyOrigin landing page', () => {
  const findEnergyOriginLogo = () =>
    screen.findByRole('img', { name: 'EnergyOrigin' });

  const findEnergiNetLogo = () =>
    screen.findByRole('img', { name: 'EnergiNet' });

  const findFooterTelLink = () =>
    screen.findByRole('a', { name: 'tel' });

  const findFooterMailLink = () =>
    screen.findByRole('a', { name: 'mail' });

  it('displays the EnergyOrigin logo', async () => {
    const { navigate } = await render(SpectacularAppComponent, {
      imports: [
        SpectacularFeatureTestingModule.withFeature({
          featureModule: EoLandingPageShellModule,
          featurePath: '',
        }),
        HttpClientTestingModule,
      ],
    });
    await navigate('/');

    expect(await findEnergyOriginLogo()).toBeInTheDocument();
  });

  it('displays the EnergiNet logo', async () => {
    const { navigate } = await render(SpectacularAppComponent, {
      imports: [
        SpectacularFeatureTestingModule.withFeature({
          featureModule: EoLandingPageShellModule,
          featurePath: '',
        }),
        HttpClientTestingModule,
      ],
    });
    await navigate('/');

    expect(await findEnergiNetLogo()).toBeInTheDocument();
  });

  it('displays a telephone link', async () => {
    const { navigate } = await render(SpectacularAppComponent, {
      imports: [
        SpectacularFeatureTestingModule.withFeature({
          featureModule: EoLandingPageShellModule,
          featurePath: '',
        }),
        HttpClientTestingModule,
      ],
    });
    await navigate('/');

    expect(await findFooterTelLink()).toHaveAttribute('href');
  });

  it('displays an e-mail link', async () => {
    const { navigate } = await render(SpectacularAppComponent, {
      imports: [
        SpectacularFeatureTestingModule.withFeature({
          featureModule: EoLandingPageShellModule,
          featurePath: '',
        }),
        HttpClientTestingModule,
      ],
    });
    await navigate('/');

    expect(await findFooterMailLink()).toHaveAttribute('href');
  });
});
