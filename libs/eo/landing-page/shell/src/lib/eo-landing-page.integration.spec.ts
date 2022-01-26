import {
  SpectacularAppComponent,
  SpectacularFeatureTestingModule,
} from '@ngworker/spectacular';
import { render, screen } from '@testing-library/angular';

import { EoLandingPageShellModule } from './eo-landing-page-shell.module';

describe('EnergyOrigin landing page', () => {
  const findEnergyOriginLogo = () =>
    screen.findByRole('img', { name: 'EnergyOrigin' });

  it('displays the EnergyOrigin logo', async () => {
    const { navigate } = await render(SpectacularAppComponent, {
      imports: [
        SpectacularFeatureTestingModule.withFeature({
          featureModule: EoLandingPageShellModule,
          featurePath: '',
        }),
      ],
    });
    await navigate('/');

    expect(await findEnergyOriginLogo()).toBeInTheDocument();
  });
});
