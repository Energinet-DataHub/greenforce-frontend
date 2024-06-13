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

import { WattProgressTrackerComponent } from './watt-progress-tracker.component';
import * as stories from './watt-progress-tracker.stories';

describe(WattProgressTrackerComponent, () => {
  it('should have pending calculation as current status', async () => {
    await render(stories.Pending().template);
    expect(screen.getByRole('status', { current: true })).toHaveAccessibleDescription(
      'Calculation pending'
    );
  });

  it('should have executing calculation as current status', async () => {
    await render(stories.Executing().template);
    expect(screen.getByRole('status', { current: true })).toHaveAccessibleDescription(
      'Calculation executing'
    );
  });

  it('should have failed calculation as current status', async () => {
    await render(stories.Failed().template);
    expect(screen.getByRole('status', { current: true })).toHaveAccessibleDescription(
      'Calculation failed'
    );
  });

  it('should have completed enqueuing as current status', async () => {
    await render(stories.Completed().template);
    expect(screen.getByRole('status', { current: true })).toHaveAccessibleDescription(
      'Enqueuing completed'
    );
  });
});
