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
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import {
  StorybookCheckboxWrapperComponent,
  StorybookCheckboxWrapperScam,
} from './storybook-checkbox-wrapper.component';
import { WattCheckboxModule } from '../watt-checkbox.module';

export default {
  title: 'Components/Checkbox',
  component: StorybookCheckboxWrapperComponent,
  decorators: [
    moduleMetadata({
      imports: [StorybookCheckboxWrapperScam],
    }),
  ],
} as Meta<StorybookCheckboxWrapperComponent>;

const howToUseGuide = `
How to use with ReactiveForms

1. Import ${WattCheckboxModule.name}

import { ${WattCheckboxModule.name} } from '@energinet-datahub/watt';

2. Create new FormControl in a component

exampleFormControl = new FormControl({
  value: true,
  disabled: false,
});

3. Assign the FormControl to the checkbox component

<watt-checkbox [formControl]="exampleFormControl">Keep me signed in</watt-checkbox>`;

export const Checkbox: Story<StorybookCheckboxWrapperComponent> = (args) => ({
  props: args,
});
Checkbox.parameters = {
  docs: {
    source: {
      code: howToUseGuide,
    },
  },
};
