import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { moduleMetadata, StoryFn, Meta, applicationConfig } from '@storybook/angular';

import { WattToastConfig } from '../watt-toast.component';
import { StorybookToastComponent } from './storybook-toast.component';

const meta: Meta<StorybookToastComponent> = {
  title: 'Components/Toast',
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(MatSnackBarModule), provideAnimations()],
    }),
    moduleMetadata({
      imports: [StorybookToastComponent],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: "Usage: `import { WattToastService } from '@energinet-datahub/watt/toast';`",
      },
    },
  },
};

export default meta;

export interface WattToastStoryConfig extends WattToastConfig {
  disableAnimations?: boolean; // Used to disable animations for the tests
  message: string;
}

export const Overview: StoryFn<WattToastStoryConfig> = (args) => ({
  props: args,
  template: `<storybook-toast [config]="{type, duration, message, action, actionLabel}" />`,
});

Overview.args = {
  type: undefined,
  message: 'You successfully launched a toast!',
  action: (ref) => {
    alert('Call alert, and dismiss the toast!');
    ref.dismiss();
  },
  actionLabel: 'Action',
};

Overview.argTypes = {
  type: {
    options: ['success', 'info', 'warning', 'danger', 'loading', undefined],
    description: '`WattToastType`',
    control: {
      type: 'radio',
      labels: { undefined: 'default (no provided type)' },
    },
  },
  duration: {
    defaultValue: 5000,
    control: { type: 'number', min: 1000, max: 10000, step: 1000 },
    table: {
      type: { summary: 'number' },
      defaultValue: { summary: '5000ms' },
    },
  },
  message: {
    description: '`string`',
  },
  action: {
    action: 'clicked',
    table: {
      type: { summary: '(ref: WattToastRef) => void' },
      defaultValue: { summary: null },
    },
  },
};

Overview.parameters = {
  docs: {
    source: {
      code: `
      import { WattToastService, WattToastRef } from "@energinet-datahub/watt";

@Component({
  selector: 'my-awesome-component',
  template: '<watt-button (click)="makeToast()">Make toast!</watt-button>',
})
export class MyAwesomeComponent {
  constructor(private toast: WattToastService) {}

  makeToast() {
    this.toast.open({
        message: 'Some awesome message!',
        action: (ref: WattToastRef) => {
            // Do something and dismiss the toast
            ref.dismiss();
        }
    });
  }
}`,
      language: 'ts',
      type: 'code',
    },
  },
};
