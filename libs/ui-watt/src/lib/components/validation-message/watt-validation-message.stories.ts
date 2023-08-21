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
import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';

import { WattValidationMessageComponent } from './watt-validation-message.component';

const meta: Meta<WattValidationMessageComponent> = {
  title: 'Components/Validation Message',
  component: WattValidationMessageComponent,
  decorators: [
    moduleMetadata({
      imports: [WattValidationMessageComponent],
    }),
  ],
};

export default meta;

const howToUseGuideBasic = `
How to use

1. Import ${WattValidationMessageComponent.name} in a module

import { ${WattValidationMessageComponent.name} } from '@energinet-datahub/watt/validation-message';

2. Use the component

<watt-validation-message label="Label" message="Message" icon="info" type="danger" size="compact"></watt-validation-message>`;

export const Compact: StoryFn<WattValidationMessageComponent> = (args) => ({
  props: args,
});

Compact.parameters = {
  docs: {
    source: {
      code: howToUseGuideBasic,
    },
  },
};

Compact.args = {
  label: 'Info',
  message: 'The metering point is not active',
  type: 'info',
  size: 'compact',
};

export const Normal: StoryFn<WattValidationMessageComponent> = (args) => ({
  props: args,
});

Normal.parameters = {
  docs: {
    source: {
      code: howToUseGuideBasic,
    },
  },
};

Normal.args = {
  label: 'Warning',
  message: 'The metering point is not active',
  type: 'warning',
  icon: 'warning',
  size: 'normal',
};
