import { render, screen } from '@testing-library/angular';

import { EoProductLogoDirective } from './eo-product-logo.directive';

describe(EoProductLogoDirective, () => {
  beforeEach(async () => {
    await render('<img eoProductLogo>', {
      imports: [EoProductLogoDirective],
    });

    hostElement = screen.getByRole('img');
  });

  let hostElement: HTMLImageElement;

  it('has an accessible name', () => {
    expect(hostElement).toHaveAccessibleName('Energy Origin');
  });

  it('renders the product logo', () => {
    expect(hostElement).toHaveAttribute('src', expect.stringMatching(/\/energy-origin-logo.svg$/));
  });
});
