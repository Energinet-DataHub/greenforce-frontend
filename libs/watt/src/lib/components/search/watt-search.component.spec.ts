import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { WattSearchComponent } from './watt-search.component';

describe(WattSearchComponent, () => {
  it('clear input (using button)', async () => {
    await render(WattSearchComponent);

    const search = screen.getByRole('searchbox');
    const button = screen.getByRole('button');

    userEvent.type(search, 'test');
    expect(search).toHaveValue('test');

    userEvent.click(button);
    expect(search).toHaveValue('');
  });

  it('clear input (using component API)', async () => {
    const { fixture } = await render(WattSearchComponent);

    const search = screen.getByRole('searchbox');
    userEvent.type(search, 'test');

    fixture.componentInstance.clear();

    expect(search).toHaveValue('');
  });
});
