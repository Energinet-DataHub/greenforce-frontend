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
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { within, fireEvent } from '@storybook/testing-library';

import { StorybookConfigurationLocalizationModule } from '../../+storybook/storybook-configuration-localization.module';
import { WattDatepickerComponent } from '../watt-datepicker.component';
import { WattDatepickerModule } from '../watt-datepicker.module';
import { WattFormFieldModule } from '../../../form-field/form-field.module';
import { WattRangeValidators } from '../../shared/validators';

export default {
  title: 'Components/Datepicker',
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        WattFormFieldModule,
        WattDatepickerModule,
        BrowserAnimationsModule,
        StorybookConfigurationLocalizationModule.forRoot(),
      ],
    }),
  ],
  component: WattDatepickerComponent,
} as Meta;

const template = `
<watt-form-field>
  <watt-label>Single date</watt-label>
  <watt-datepicker [formControl]="exampleFormControlSingle"></watt-datepicker>
  <watt-error *ngIf="exampleFormControlSingle?.errors?.required">
      Date is required
  </watt-error>
</watt-form-field>

<p>Value: <code>{{exampleFormControlSingle.value | json}}</code></p>
<p *ngIf="withValidations">Errors: <code>{{exampleFormControlSingle?.errors | json}}</code></p>

<br />

<watt-form-field>
  <watt-label>Date range</watt-label>
  <watt-datepicker [formControl]="exampleFormControlRange" [range]="true"></watt-datepicker>
  <watt-error *ngIf="exampleFormControlRange?.errors?.rangeRequired">
      Date range is required
  </watt-error>
</watt-form-field>

<p>Selected range: <code>{{exampleFormControlRange.value | json}}</code></p>
<p *ngIf="withValidations">Errors: <code>{{exampleFormControlRange?.errors | json}}</code></p>
`;

const initialValue = '22-11-3333';

export const withFormControl: Story = (args) => ({
  props: {
    exampleFormControlSingle: new FormControl(null),
    exampleFormControlRange: new FormControl(null),
    ...args,
  },
  template,
});

withFormControl.parameters = {
  docs: {
    source: {
      code: `
HTML
${template}
TypeScript
exampleFormControl = new FormControl();
      `,
    },
  },
};

export const withInitialValue: Story = (args) => ({
  props: {
    exampleFormControlSingle: new FormControl(initialValue),
    exampleFormControlRange: new FormControl({
      start: initialValue,
      end: initialValue,
    }),
    ...args,
  },
  template,
});

export const withValidations: Story = (args) => ({
  props: {
    exampleFormControlSingle: new FormControl(null, [Validators.required]),
    exampleFormControlRange: new FormControl(null, [
      WattRangeValidators.required(),
    ]),
    withValidations: true,
    ...args,
  },
  template,
});

withValidations.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const dateInput: HTMLInputElement = canvas.getByRole('textbox', {
    name: /^date-input/i,
  });
  const startDateInput: HTMLInputElement = canvas.getByRole('textbox', {
    name: /start-date-input/i,
  });
  fireEvent.focusOut(dateInput);
  fireEvent.focusOut(startDateInput);
};

export const withFormControlDisabled: Story = (args) => ({
  props: {
    exampleFormControlSingle: new FormControl({ value: null, disabled: true }),
    exampleFormControlRange: new FormControl({ value: null, disabled: true }),
    ...args,
  },
  template,
});
