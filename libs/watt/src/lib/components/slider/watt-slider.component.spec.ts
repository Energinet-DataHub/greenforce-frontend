import { render, screen } from '@testing-library/angular';
import { WattSliderComponent } from './watt-slider.component';

describe.skip(WattSliderComponent, () => {
  it('renders', async () => {
    await render(WattSliderComponent);

    expect(screen.queryAllByRole('slider')).toHaveLength(2);
  });
});
