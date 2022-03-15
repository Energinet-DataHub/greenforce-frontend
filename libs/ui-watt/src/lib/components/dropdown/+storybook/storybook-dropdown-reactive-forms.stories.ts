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
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { WattFormFieldModule } from '../../form-field/form-field.module';
import { WattDropdownModule } from '../watt-dropdown.module';
import {
  WattDropdownComponent,
  WattDropdownOption,
} from '../watt-dropdown.component';

const dropdownOptions: WattDropdownOption[] = [
  { value: 'mightyDucks', displayValue: 'Mighty Ducks' },
  { value: 'batman', displayValue: 'Batman' },
  { value: 'titans', displayValue: 'Titans' },
  { value: 'volt', displayValue: 'Volt' },
  { value: 'joules', displayValue: 'Joules' },
];

export default {
  title: 'Components/Dropdown/Reactive Forms',
  component: WattDropdownComponent,
  decorators: [
    moduleMetadata({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        WattDropdownModule,
        WattFormFieldModule,
      ],
    }),
  ],
} as Meta<WattDropdownComponent>;

const howToUseGuideBasic = `
 How to use
 
 1. Import ${WattDropdownModule.name} in a module
 
 import { ${WattDropdownModule.name} } from '@energinet-datahub/watt';

 2a. Create FormControl in a component and define dropdown options.
 
 exampleFormControl = new FormControl(null);

 2b. Define dropdown options by using the WattDropdownOption interface

 options: WattDropdownOption[] = [{ value: 'example', displayValue: 'Example' },]
 
 3. Assign the FormControl and options to the dropdown component
 
 <watt-dropdown [formControl]="exampleFormControl" [options]="options"></watt-dropdown>
 
 4. Wrap the dropdown component in a "watt-form-field"

 <watt-form-field>
  <watt-dropdown [formControl]="exampleFormControl" [options]="options"></watt-dropdown>
 </watt-form-field>`;

export const withFormControl: Story<WattDropdownComponent> = () => ({
  props: {
    exampleFormControl: new FormControl(true),
    options: dropdownOptions,
  },
  template: `<watt-form-field>
    <watt-dropdown [formControl]="exampleFormControl" [options]="options"></watt-dropdown>
  </watt-form-field>`,
});
withFormControl.parameters = {
  docs: {
    source: {
      code: howToUseGuideBasic,
    },
  },
};
