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
import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { StorybookInputWrapperComponent } from './storybook-input-wrapper.component';
import { StorybookInputModule } from './storybook-input-wrapper.module';
import StorybookInputOverviewDocs from './storybook-input-overview.mdx';

export default {
  title: 'Components/Text Field',
  component: StorybookInputWrapperComponent,
  decorators: [
    moduleMetadata({
      imports: [StorybookInputModule],
    }),
  ],
  parameters: {
    docs: {
      page: StorybookInputOverviewDocs,
    },
  },
} as Meta<StorybookInputWrapperComponent>;

const Template: Story<StorybookInputWrapperComponent> = (args) => ({
  props: args,
});

const overviewTemplate: Story = () => ({
  template: `<storybook-input-overview></storybook-input-overview>`,
});

export const overview = overviewTemplate.bind({});
overview.argTypes = {
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
};
overview.parameters = {
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
};

export const assistiveText = Template.bind({});
assistiveText.args = {
  hasHint: true,
};
assistiveText.parameters = {
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
};
