import { render, screen } from '@testing-library/angular';

import { DhMeteringPointSearchComponent, DhMeteringPointSearchScam } from './dh-metering-point-search.component';

describe(DhMeteringPointSearchComponent.name, () => {
  let input: HTMLElement;

  beforeEach(async () => {
    await render(DhMeteringPointSearchComponent, {
      imports: [DhMeteringPointSearchScam]
    });

    input = screen.getByRole('textbox', { name: /search-input/i });
  });

  it('should render input', async () => {
    expect(input).toBeTruthy();
  });

  it('should focus the input on load', async () => {
    expect(input).toHaveFocus();
  });
});
