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
import { StoryObj, Meta, moduleMetadata, StoryFn } from '@storybook/angular';

import { WattValidationMessageComponent } from './watt-validation-message.component';
import { WattValidationMessageModule } from './watt-validation-message.module';

const meta: Meta<WattValidationMessageComponent> = {
  title: 'Components/Validation Message',
  component: WattValidationMessageComponent,
  decorators: [
    moduleMetadata({
      imports: [WattValidationMessageModule],
    }),
  ],
};

export default meta;

const howToUseGuideBasic = `
How to use

1. Import ${WattValidationMessageModule.name} in a module

import { ${WattValidationMessageModule.name} } from '@energinet-datahub/watt/validation-message';

2. Use the component

<watt-validation-message label="Label" message="Message" type="danger"></watt-validation-message>`;

export const ValidationMessage: StoryObj<WattValidationMessageComponent> = {
  render: (args) => ({
    props: args,
  }),

  parameters: {
    docs: {
      source: {
        code: howToUseGuideBasic,
      },
    },
  },

  args: {
    label: 'Info',
    message: 'The metering point is not active',
    type: 'info',
  },
};
