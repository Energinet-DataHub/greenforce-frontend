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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { StorybookConfigurationLocalizationModule } from '../../+storybook/configuration-localization/storybook-configuration-localization.module';

import { WattFormFieldModule } from '../../../form-field/form-field.module';
import { WattTimepickerComponent } from '../watt-timepicker.component';
import { WattTimepickerModule } from '../watt-timepicker.module';

export default {
  title: 'Components/Timepicker',
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        WattFormFieldModule,
        WattTimepickerModule,
        BrowserAnimationsModule,
        StorybookConfigurationLocalizationModule.forRoot(),
      ],
    }),
  ],
  component: WattTimepickerComponent,
} as Meta<WattTimepickerComponent>;

export const withFormControl: Story<WattTimepickerComponent> = (args) => ({
  props: {
    ...args,
    timeRangeControl: new FormControl(),
  },
  template: `
    <watt-form-field>
     <watt-label>Time range</watt-label>
     <watt-timepicker [formControl]="timeRangeControl"></watt-timepicker>
    </watt-form-field>

    <p>Selected range: {{ timeRangeControl.value | json }}</p>`,
});

export const withInitialValue: Story<WattTimepickerComponent> = (args) => ({
  props: {
    ...args,
    timeRangeControl: new FormControl({ start: '00:00', end: '23:59' }),
  },
  template: `
    <watt-form-field>
     <watt-label>Time range</watt-label>
     <watt-timepicker [formControl]="timeRangeControl"></watt-timepicker>
    </watt-form-field>

    <p>Selected range: {{ timeRangeControl.value | json }}</p>`,
});
