import { render, screen } from '@testing-library/angular';
import { WattCardComponent, WATT_CARD } from './';

describe(WattCardComponent, () => {
  it('renders card title', async () => {
    await render(
      `
      <watt-card>
        <watt-card-title>
          <h3>Card title</h3>
        </watt-card-title>

        Card content
      </watt-card>
    `,
      {
        imports: [WATT_CARD],
      }
    );

    expect(screen.getByText('Card title')).toBeInTheDocument();
  });

  it('renders card content', async () => {
    await render(
      `
      <watt-card>
        Card content
      </watt-card>
    `,
      {
        imports: [WATT_CARD],
      }
    );

    expect(screen.getByText('Card content')).toBeInTheDocument();
  });
});
