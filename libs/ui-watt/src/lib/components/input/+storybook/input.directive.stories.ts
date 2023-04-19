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
import { moduleMetadata, StoryFn, Meta, applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';

import { StorybookInputWrapperComponent } from './storybook-input-wrapper.component';
import { StorybookInputOverviewComponent } from './storybook-input-overview.component';

const meta: Meta<StorybookInputWrapperComponent> = {
  title: 'Components/Text Field',
  component: StorybookInputWrapperComponent,
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      imports: [StorybookInputOverviewComponent],
    }),
  ],
};

export default meta;

const Template: StoryFn<StorybookInputWrapperComponent> = (args) => ({
  props: args,
});

const overviewTemplate: StoryFn = () => ({
  template: `<storybook-input-overview></storybook-input-overview>`,
});

export const Overview = {
  render: overviewTemplate,

  argTypes: {
    disabled: {
      table: {
        disable: true,
      },
    },
    focused: {
      table: {
        disable: true,
      },
    },
    hasError: {
      table: {
        disable: true,
      },
    },
    hasHint: {
      table: {
        disable: true,
      },
    },
    hasPrefix: {
      table: {
        disable: true,
      },
    },
    hasSuffix: {
      table: {
        disable: true,
      },
    },
    label: {
      table: {
        disable: true,
      },
    },
    placeholder: {
      table: {
        disable: true,
      },
    },
    required: {
      table: {
        disable: true,
      },
    },
    size: {
      table: {
        disable: true,
      },
    },
    isTextArea: {
      table: {
        disable: true,
      },
    },
  },

  parameters: {
    controls: { hideNoControlsWarning: true },
    docs: {
      source: {
        code: `HTML:
  <watt-form-field>
    <watt-label>label</watt-label>
    <input wattInput [formControl]="exampleFormControl" />
    <watt-hint>Some hint</watt-hint>
    <watt-hint align="end">{{exampleFormControl.value.length}} / 256</watt-hint>
  </watt-form-field>

  TypeScript:
  exampleFormControl = new FormControl('');
  `,
      },
    },
  },
};

export const AssistiveText = {
  render: Template,

  args: {
    hasHint: true,
  },

  parameters: {
    docs: {
      source: {
        code: `HTML:
  <watt-form-field>
    <watt-label>label</watt-label>
    <input wattInput [formControl]="exampleFormControl" />
    <watt-hint>Some hint</watt-hint>
    <watt-hint align="end">{{exampleFormControl.value.length}} / 256</watt-hint>
  </watt-form-field>

  TypeScript:
  exampleFormControl = new FormControl('');
  `,
      },
    },
  },
};
