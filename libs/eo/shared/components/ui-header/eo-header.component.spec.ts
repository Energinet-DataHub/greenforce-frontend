import { render, screen } from '@testing-library/angular';
import { EoHeaderComponent } from './eo-header.component';

describe(EoHeaderComponent, () => {
  const findEnergyOriginLogo = () => screen.findByRole('img', { name: 'Energy Origin' });

  it('displays the Energy Origin logo', async () => {
    await render(EoHeaderComponent);
    expect(await findEnergyOriginLogo()).toBeInTheDocument();
  });

  it('Inserts content into ng-content', async () => {
    await render(`<eo-header><p>test</p></eo-header>`, {
      imports: [EoHeaderComponent],
    });
    expect(await screen.findByText('test')).toBeInTheDocument();
  });
});
