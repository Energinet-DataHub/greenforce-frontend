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
import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';

import { WattProgressTrackerComponent } from './watt-progress-tracker.component';
import { WattProgressTrackerStepComponent } from './watt-progress-tracker-step.component';

const meta: Meta<WattProgressTrackerComponent> = {
  title: 'Components/Progress Tracker',
  component: WattProgressTrackerComponent,
  decorators: [
    moduleMetadata({
      imports: [WattProgressTrackerStepComponent],
    }),
  ],
};

export default meta;

export const Pending = (() => ({
  template: `
    <watt-progress-tracker>
      <watt-progress-tracker-step status="completed" label="Schedule completed">
        Scheduled
      </watt-progress-tracker-step>
      <watt-progress-tracker-step status="pending" label="Calculation pending" [current]="true">
        Calculated
      </watt-progress-tracker-step>
      <watt-progress-tracker-step status="pending" label="Enqueuing pending">
        Enqueued
      </watt-progress-tracker-step>
    </watt-progress-tracker>
  `,
})) satisfies StoryFn<WattProgressTrackerComponent>;

export const Executing = (() => ({
  template: `
    <watt-progress-tracker>
      <watt-progress-tracker-step status="completed" label="Schedule completed">
        Scheduled
      </watt-progress-tracker-step>
      <watt-progress-tracker-step status="executing" label="Calculation executing" [current]="true">
        Calculated
      </watt-progress-tracker-step>
      <watt-progress-tracker-step status="pending" label="Enqueuing pending">
        Enqueued
      </watt-progress-tracker-step>
    </watt-progress-tracker>
  `,
})) satisfies StoryFn<WattProgressTrackerComponent>;

export const Failed = (() => ({
  template: `
    <watt-progress-tracker>
      <watt-progress-tracker-step status="completed" label="Schedule completed">
        Scheduled
      </watt-progress-tracker-step>
      <watt-progress-tracker-step status="failed" label="Calculation failed" [current]="true">
        Calculated
      </watt-progress-tracker-step>
      <watt-progress-tracker-step status="pending" label="Enqueuing pending">
        Enqueued
      </watt-progress-tracker-step>
    </watt-progress-tracker>
  `,
})) satisfies StoryFn<WattProgressTrackerComponent>;

export const Completed = (() => ({
  template: `
    <watt-progress-tracker>
      <watt-progress-tracker-step status="completed" label="Schedule completed">
        Scheduled
      </watt-progress-tracker-step>
      <watt-progress-tracker-step status="completed" label="Calculation completed">
        Calculated
      </watt-progress-tracker-step>
      <watt-progress-tracker-step status="completed" label="Enqueuing completed" [current]="true">
        Enqueued
      </watt-progress-tracker-step>
    </watt-progress-tracker>
  `,
})) satisfies StoryFn<WattProgressTrackerComponent>;
