import { render, screen } from '@testing-library/angular';

import { WATT_PROGRESS_TRACKER, WattProgressTrackerComponent } from './';
import * as stories from './watt-progress-tracker.stories';

describe(WattProgressTrackerComponent, () => {
  it('should have pending calculation as current status', async () => {
    await render(stories.Pending().template, { imports: WATT_PROGRESS_TRACKER });
    expect(screen.getByRole('status', { current: 'step' })).toHaveAccessibleName(
      'Calculation pending'
    );
  });

  it('should have executing calculation as current status', async () => {
    await render(stories.Executing().template, { imports: WATT_PROGRESS_TRACKER });
    expect(screen.getByRole('status', { current: 'step' })).toHaveAccessibleName(
      'Calculation executing'
    );
  });

  it('should have failed calculation as current status', async () => {
    await render(stories.Failed().template, { imports: WATT_PROGRESS_TRACKER });
    expect(screen.getByRole('status', { current: 'step' })).toHaveAccessibleName(
      'Calculation failed'
    );
  });

  it('should have completed enqueuing as current status', async () => {
    await render(stories.Completed().template, { imports: WATT_PROGRESS_TRACKER });
    expect(screen.getByRole('status', { current: 'step' })).toHaveAccessibleName(
      'Enqueuing completed'
    );
  });
});
