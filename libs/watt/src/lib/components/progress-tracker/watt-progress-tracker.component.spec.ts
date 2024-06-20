/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
