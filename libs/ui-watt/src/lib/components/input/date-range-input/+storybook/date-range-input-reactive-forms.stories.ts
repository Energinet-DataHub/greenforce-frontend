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
import { within, fireEvent } from '@storybook/testing-library';

import { StorybookConfigurationLocalizationModule } from '../../+storybook/configuration-localization/storybook-configuration-localization.module';

import { WattDateRangeInputComponent } from '../watt-date-range-input.component';
import { WattDateRangeInputModule } from '../watt-date-range-input.module';
import { WattFormFieldModule } from '../../../form-field/form-field.module';
import { WattRangeValidators } from '../../shared/range.validators';

export default {
  title: 'Components/Date-range Input/Reactive Forms',
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        WattFormFieldModule,
        WattDateRangeInputModule,
        BrowserAnimationsModule,
        StorybookConfigurationLocalizationModule.forRoot(),
      ],
    }),
  ],
  component: WattDateRangeInputComponent,
} as Meta;

const template = `
<watt-form-field>
  <watt-label>Date range</watt-label>
  <watt-date-range-input [formControl]="exampleFormControl"></watt-date-range-input>
  <watt-error *ngIf="exampleFormControl.errors?.requiredRange">
      Field is required
  </watt-error>
  <watt-error *ngIf="exampleFormControl.errors?.startOfRangeRequired">
      Start of range is required
  </watt-error>
  <watt-error *ngIf="exampleFormControl.errors?.endOfRangeRequired">
      End of range is required
  </watt-error>
</watt-form-field>

<p>Selected range: <code>{{exampleFormControl.value | json}}</code></p>
<p *ngIf="withValidations">Errors: <code>{{exampleFormControl.errors | json}}</code></p>
`;

export const withFormControl: Story<WattDateRangeInputComponent> = (args) => ({
  props: {
    exampleFormControl: new FormControl(null),
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

export const withInitialValue: Story<WattDateRangeInputComponent> = (args) => ({
  props: {
    exampleFormControl: new FormControl({
      start: '22-11-3333',
      end: '22-11-3333',
    }),
    ...args,
  },
  template,
});

export const withValidations: Story<WattDateRangeInputComponent> = (args) => ({
  props: {
    exampleFormControl: new FormControl(null, [WattRangeValidators.required()]),
    withValidations: true,
    ...args,
  },
  template
});

withValidations.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const startDateInput: HTMLInputElement = canvas.getByRole('textbox', {
    name: /start-date-input/i,
  });
  fireEvent.focusOut(startDateInput);
};
