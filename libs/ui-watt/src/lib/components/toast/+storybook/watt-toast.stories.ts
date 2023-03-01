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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { WattToastConfig } from '../watt-toast.component';
import { StorybookToastModule } from './storybook-toast.component';

export default {
  title: 'Components/Toast',
  decorators: [
    moduleMetadata({
      imports: [StorybookToastModule],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: "Usage: `import { WattToastService } from '@energinet-datahub/watt/toast';`",
      },
    },
  },
} as Meta;

export interface WattToastStoryConfig extends WattToastConfig {
  disableAnimations?: boolean; // Used to disable animations for the tests
  message: string;
}

export const Overview: Story<WattToastStoryConfig> = (args) => ({
  props: args,
  template: `<storybook-toast [config]="{type, duration, message, action, actionLabel}"></storybook-toast>`,
  moduleMetadata: {
    imports: [
      BrowserAnimationsModule.withConfig({
        disableAnimations: !!args.disableAnimations,
      }),
    ],
  },
});

Overview.args = {
  type: undefined,
  message: 'You successfully launched a toast!',
  action: (ref) => {
    alert('Call alert, and dismiss the toast!');
    ref.dismiss();
  },
  actionLabel: 'action',
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
