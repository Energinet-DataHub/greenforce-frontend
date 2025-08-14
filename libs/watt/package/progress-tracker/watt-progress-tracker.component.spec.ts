//#region License
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
//#endregion
import { render, screen } from '@testing-library/angular';

import { WATT_PROGRESS_TRACKER, WattProgressTrackerComponent } from './';

describe(WattProgressTrackerComponent, () => {
  it('should have pending calculation as current status', async () => {
    const template = `
      <watt-progress-tracker>
        <watt-progress-tracker-step status="succeeded" label="Schedule completed">
          Scheduled
        </watt-progress-tracker-step>
        <watt-progress-tracker-step status="pending" label="Calculation pending" [current]="true">
          Calculated
        </watt-progress-tracker-step>
        <watt-progress-tracker-step status="pending" label="Enqueuing pending">
          Enqueued
        </watt-progress-tracker-step>
      </watt-progress-tracker>
    `;
    await render(template, { imports: WATT_PROGRESS_TRACKER });
    expect(screen.getByRole('status', { current: 'step' })).toHaveAccessibleName(
      'Calculation pending'
    );
  });

  it('should have executing calculation as current status', async () => {
    const template = `
      <watt-progress-tracker>
        <watt-progress-tracker-step status="succeeded" label="Schedule completed">
          Scheduled
        </watt-progress-tracker-step>
        <watt-progress-tracker-step status="running" label="Calculation executing" [current]="true">
          Calculated
        </watt-progress-tracker-step>
        <watt-progress-tracker-step status="pending" label="Enqueuing pending">
          Enqueued
        </watt-progress-tracker-step>
      </watt-progress-tracker>
    `;
    await render(template, { imports: WATT_PROGRESS_TRACKER });
    expect(screen.getByRole('status', { current: 'step' })).toHaveAccessibleName(
      'Calculation executing'
    );
  });

  it('should have failed calculation as current status', async () => {
    const template = `
      <watt-progress-tracker>
        <watt-progress-tracker-step status="succeeded" label="Schedule completed">
          Scheduled
        </watt-progress-tracker-step>
        <watt-progress-tracker-step status="failed" label="Calculation failed" [current]="true">
          Calculated
        </watt-progress-tracker-step>
        <watt-progress-tracker-step status="pending" label="Enqueuing pending">
          Enqueued
        </watt-progress-tracker-step>
      </watt-progress-tracker>
    `;
    await render(template, { imports: WATT_PROGRESS_TRACKER });
    expect(screen.getByRole('status', { current: 'step' })).toHaveAccessibleName(
      'Calculation failed'
    );
  });

  it('should have completed enqueuing as current status', async () => {
    const template = `
      <watt-progress-tracker>
        <watt-progress-tracker-step status="succeeded" label="Schedule completed">
          Scheduled
        </watt-progress-tracker-step>
        <watt-progress-tracker-step status="succeeded" label="Calculation completed">
          Calculated
        </watt-progress-tracker-step>
        <watt-progress-tracker-step status="succeeded" label="Enqueuing completed" [current]="true">
          Enqueued
        </watt-progress-tracker-step>
      </watt-progress-tracker>
    `;
    await render(template, { imports: WATT_PROGRESS_TRACKER });
    expect(screen.getByRole('status', { current: 'step' })).toHaveAccessibleName(
      'Enqueuing completed'
    );
  });
});
