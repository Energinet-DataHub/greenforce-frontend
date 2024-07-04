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
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { within, fireEvent } from '@storybook/testing-library';

import { localizationProviders } from '../../shared/+storybook/storybook-configuration-localization.providers';
import { WattFieldErrorComponent } from '../../../field/watt-field-error.component';
import { WattFormChipDirective } from '../../../field/chip.directive';
import { WattRangeValidators } from '../../shared/validators';

import { WattDateChipComponent } from '../watt-date-chip.component';
import { WattDateRangeChipComponent } from '../watt-date-range-chip.component';
import { WattDatepickerComponent } from '../watt-datepicker.component';
import { startDateCannotBeOlderThan3DaysValidator } from './watt-datepicker-custom-validator';

export const initialValueSingle = '2022-09-02T22:00:00.000Z';
export const initialValueRangeStart = initialValueSingle;
export const initialValueRangeEnd_StartOfDay = '2022-09-14T22:00:00.000Z';
export const initialValueRangeEnd_EndOfDay = '2022-09-15T21:59:59.999Z';

export interface WattDatepickerStoryConfig extends WattDatepickerComponent {
  disableAnimations?: boolean; // Used to disable animations for the tests
}

export default {
  title: 'Components/Datepicker',
  decorators: [
    applicationConfig({
      providers: [provideAnimations(), localizationProviders],
    }),
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        WattFormChipDirective,
        WattDateChipComponent,
        WattDateRangeChipComponent,
        WattFieldErrorComponent,
        WattDatepickerComponent,
      ],
    }),
  ],
  component: WattDatepickerComponent,
  excludeStories: [
    'initialValueSingle',
    'initialValueRangeStart',
    'initialValueRangeEnd_StartOfDay',
    'initialValueRangeEnd_EndOfDay',
  ],
} as Meta;

const template = `

<watt-datepicker label="Single date" [formControl]="exampleFormControlSingle">
  @if (exampleFormControlSingle?.errors?.startDateCannotBeOlderThan3Days) {
    <watt-field-error>Start date cannot be older than 3 days</watt-field-error>
  }
</watt-datepicker>

<p>Value: <code>{{ exampleFormControlSingle.value | json }}</code></p>
@if (withValidations) {
  <p>Errors: <code>{{ exampleFormControlSingle?.errors | json }}</code></p>
}

<br />

<watt-datepicker label="Date range" [formControl]="exampleFormControlRange" [range]="true" />

<p>Selected range: <code data-testid="rangeValue">{{ exampleFormControlRange.value | json }}</code></p>
@if (withValidations) {
  <p>Errors: <code>{{ exampleFormControlRange?.errors | json }}</code></p>
}

<watt-date-chip [formControl]="exampleChipFormControlSingle">
  Single date
</watt-date-chip>


<p>Value: <code>{{ exampleChipFormControlSingle.value | json }}</code></p>
@if (withValidations) {
  <p>Errors: <code>{{ exampleChipFormControlSingle?.errors | json }}</code></p>
}

<watt-date-range-chip [formControl]="exampleChipFormControlRange">
  Date range
</watt-date-range-chip>

<p>Selected range: <code data-testid="rangeValue">{{ exampleChipFormControlRange.value | json }}</code></p>
@if (withValidations) {
  <p>Errors: <code>{{ exampleChipFormControlRange?.errors | json }}</code></p>
}
`;

export const WithFormControl: StoryFn<WattDatepickerStoryConfig> = (args) => ({
  props: {
    exampleFormControlSingle: new FormControl(null),
    exampleFormControlRange: new FormControl(null),
    exampleChipFormControlSingle: new FormControl(null),
    exampleChipFormControlRange: new FormControl(null),
    ...args,
  },
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

export const WithInitialValue: StoryFn<WattDatepickerStoryConfig> = (args) => ({
  props: {
    exampleFormControlSingle: new FormControl(initialValueSingle),
    exampleFormControlRange: new FormControl({
      start: initialValueRangeStart,
      end: initialValueRangeEnd_EndOfDay,
    }),
    exampleChipFormControlSingle: new FormControl(initialValueSingle),
    exampleChipFormControlRange: new FormControl({
      start: initialValueRangeStart,
      end: initialValueRangeEnd_EndOfDay,
    }),
    ...args,
  },
  template,
});

export const WithValidations: StoryFn<WattDatepickerStoryConfig> = (args) => ({
  props: {
    exampleFormControlSingle: new FormControl(null, [
      Validators.required,
      startDateCannotBeOlderThan3DaysValidator(),
    ]),
    exampleFormControlRange: new FormControl(null, [WattRangeValidators.required]),
    exampleChipFormControlSingle: new FormControl(null, [Validators.required]),
    exampleChipFormControlRange: new FormControl(null, [WattRangeValidators.required]),
    withValidations: true,
    ...args,
  },
  template,
});

WithValidations.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  canvas.getAllByRole('button').forEach((button) => fireEvent.focusOut(button));
};

export const WithFormControlDisabled: StoryFn<WattDatepickerStoryConfig> = (args) => ({
  props: {
    exampleFormControlSingle: new FormControl({ value: initialValueSingle, disabled: true }),
    exampleFormControlRange: new FormControl({
      value: {
        start: initialValueRangeStart,
        end: initialValueRangeEnd_EndOfDay,
      },
      disabled: true,
    }),
    exampleChipFormControlSingle: new FormControl({ value: null, disabled: true }),
    exampleChipFormControlRange: new FormControl({ value: null, disabled: true }),
    ...args,
  },
  template,
});
