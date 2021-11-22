import { render, screen } from '@testing-library/angular';

import { getTranslocoTestingModule } from '@energinet-datahub/dh/globalization/configuration-localization';

import {
  DhMeteringPointSearchComponent,
  DhMeteringPointSearchScam,
} from './dh-metering-point-search.component';

describe(DhMeteringPointSearchComponent.name, () => {
  beforeEach(async () => {
    await render(DhMeteringPointSearchComponent, {
      imports: [getTranslocoTestingModule(), DhMeteringPointSearchScam],
    });
  });

  it('should show heading of level 1', () => {
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
