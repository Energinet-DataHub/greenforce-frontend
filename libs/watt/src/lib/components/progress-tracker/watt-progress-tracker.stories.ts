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
