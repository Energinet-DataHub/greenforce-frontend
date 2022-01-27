import { render, screen } from '@testing-library/angular';

import { EoProductLogoDirective, EoProductLogoScam } from './eo-product-logo.directive';

describe(EoProductLogoDirective.name, () => {
  beforeEach(async () => {
    await render('<img eoProductLogo>', {
      imports: [EoProductLogoScam],
    });

    hostElement = screen.getByRole('img');
  });

  let hostElement: HTMLImageElement;

  it('has an accessible name', () => {
    screen.debug(hostElement);
    expect(hostElement).toHaveAccessibleName('EnergyOrigin');
  });

  it('renders the product logo', () => {
    expect(hostElement).toHaveAttribute(
      'src',
      expect.stringMatching(/\/energyorigin-logo.svg$/)
    );
  });
});
