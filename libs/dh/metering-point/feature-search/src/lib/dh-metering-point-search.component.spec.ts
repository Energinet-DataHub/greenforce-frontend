import { render, screen } from '@testing-library/angular';

import { getTranslocoTestingModule } from '@energinet-datahub/dh/globalization/configuration-localization';

import { DhMeteringPointSearchComponent, DhMeteringPointSearchScam } from './dh-metering-point-search.component';

describe(DhMeteringPointSearchComponent.name, () => {
  let input: HTMLElement;

  beforeEach(async () => {
    await render(DhMeteringPointSearchComponent, {
      imports: [getTranslocoTestingModule(), DhMeteringPointSearchScam]
    });

    input = screen.getByRole('textbox', { name: /search-input/i });
  });

  it('should render input', async () => {
    expect(input).toBeTruthy();
  });

  it('should focus the input on load', async () => {
    // We check this by attribute, as toHaveFocus is not working unless you do .focus() on the element
    expect(input).toHaveAttribute('autofocus');
  });
});
