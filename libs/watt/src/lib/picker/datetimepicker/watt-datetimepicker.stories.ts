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
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { localizationProviders } from '../shared/+storybook/storybook-configuration-localization.providers';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattDatetimepickerComponent } from './watt-datetimepicker.component';
import dayjs from 'dayjs';

const dateTimeCannotBeOlderThan3DaysValidator =
  () =>
  (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const startDate = dayjs(value).toDate();

    if (startDate < dayjs().subtract(3, 'days').toDate()) {
      return { startDateCannotBeOlderThan3Days: true };
    }

    return null;
  };

export default {
  title: 'Components/Datetimepicker',
  decorators: [
    applicationConfig({ providers: [provideAnimations(), localizationProviders] }),
    moduleMetadata({
      imports: [ReactiveFormsModule, WattDatetimepickerComponent, WattFieldErrorComponent],
    }),
  ],
  component: WattDatetimepickerComponent,
} as Meta;

const template = `
  <watt-datetimepicker label="Date and time" [formControl]="exampleFormControl">
    @if (exampleFormControl?.errors?.startDateCannotBeOlderThan3Days) {
      <watt-field-error>
        Start date cannot be older than 3 days
      </watt-field-error>
    }
  </watt-datetimepicker>

  <p>Value: <code>{{exampleFormControl.value | json}}</code></p>
  @if (withValidations) {
    <p>Errors: <code>{{exampleFormControl?.errors | json}}</code></p>
  }
`;

const initialValue = new Date();

export const WithFormControl: StoryFn<WattDatetimepickerComponent> = (args) => ({
  props: { exampleFormControl: new FormControl(null), ...args },
  template,
});

WithFormControl.parameters = {
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

export const WithInitialValue: StoryFn<WattDatetimepickerComponent> = (args) => ({
  props: { exampleFormControl: new FormControl(initialValue), ...args },
  template,
});

export const WithValidations: StoryFn<WattDatetimepickerComponent> = (args) => ({
  props: {
    exampleFormControl: new FormControl(dayjs().subtract(4, 'days').toDate(), [
      Validators.required,
      dateTimeCannotBeOlderThan3DaysValidator(),
    ]),
    withValidations: true,
    ...args,
  },
  template,
});

export const WithFormControlDisabled: StoryFn<WattDatetimepickerComponent> = (args) => ({
  props: { exampleFormControl: new FormControl({ value: null, disabled: true }), ...args },
  template,
});
