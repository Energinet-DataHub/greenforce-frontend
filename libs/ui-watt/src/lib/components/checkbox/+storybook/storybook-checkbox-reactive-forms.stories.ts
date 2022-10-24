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
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { WattCheckboxModule } from '../watt-checkbox.module';
import { WattCheckboxComponent } from '../watt-checkbox.component';

export default {
  title: 'Components/Checkbox/Reactive Forms',
  component: WattCheckboxComponent,
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, WattCheckboxModule],
    }),
  ],
} as Meta<WattCheckboxComponent>;

const howToUseGuideBasic = `
How to use

1. Import ${WattCheckboxModule.name} in a module

import { ${WattCheckboxModule.name} } from '@energinet-datahub/watt/checkbox';

2. Create FormControl in a component

exampleFormControl = new FormControl(true);

3. Assign the FormControl to the checkbox component

<watt-checkbox [formControl]="exampleFormControl">Keep me signed in</watt-checkbox>`;

export const withFormControl: Story<WattCheckboxComponent> = () => ({
  props: {
    exampleFormControl: new FormControl(true),
  },
  template: `<watt-checkbox [formControl]="exampleFormControl">Keep me signed in</watt-checkbox>`,
});
withFormControl.parameters = {
  docs: {
    source: {
      code: howToUseGuideBasic,
    },
  },
};

const howToUseGuideDisabled = `
How to use

1. Import ${WattCheckboxModule.name} in a module

import { ${WattCheckboxModule.name} } from '@energinet-datahub/watt/checkbox';

2. Create FormControl in a component

exampleFormControl = new FormControl({ value: true, disabled: true }),

3. Assign the FormControl to the checkbox component

<watt-checkbox [formControl]="exampleFormControl">Keep me signed in</watt-checkbox>`;

export const Disabled: Story<WattCheckboxComponent> = () => ({
  props: {
    exampleFormControl: new FormControl({ value: true, disabled: true }),
  },
  template: `<watt-checkbox [formControl]="exampleFormControl">Keep me signed in</watt-checkbox>`,
});
Disabled.parameters = {
  docs: {
    source: {
      code: howToUseGuideDisabled,
    },
  },
};
