import { render, screen } from '@testing-library/angular';

import {
  WattExpandableCardComponent,
  WATT_EXPANDABLE_CARD_COMPONENTS,
} from './watt-expandable-card.component';

const template = `
  <watt-expandable-card [expanded]="expanded">
    <watt-expandable-card-title>Title</watt-expandable-card-title>
    <p>Body</p>
  </watt-expandable-card>
`;

describe(WattExpandableCardComponent, () => {
  async function setup(args: Partial<WattExpandableCardComponent>) {
    await render(template, {
      componentProperties: args,
      imports: [WATT_EXPANDABLE_CARD_COMPONENTS],
    });
  }

  it('renders collapsed', async () => {
    await setup({ expanded: false });
    expect(screen.getByRole('button', { expanded: false })).toBeInTheDocument();
  });

  it('renders expanded', async () => {
    await setup({ expanded: true });
    expect(screen.getByRole('button', { expanded: true })).toBeInTheDocument();
  });
});
