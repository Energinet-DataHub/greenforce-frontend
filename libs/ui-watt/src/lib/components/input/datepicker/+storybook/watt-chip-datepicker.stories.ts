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
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { ChipDatepickerExampleComponent } from './watt-chip-datepicker.example.component';
import { importProvidersFrom } from '@angular/core';
import { StorybookConfigurationLocalizationModule } from '../../+storybook/storybook-configuration-localization.module';
import { FormControl, Validators } from '@angular/forms';
import { WattRangeValidators } from '../../shared/validators';

const initialValueRangeStart = '2022-09-02T22:00:00.000Z';
const initialValueRangeEnd_StartOfDay = '2022-09-14T22:00:00.000Z';

const meta: Meta<ChipDatepickerExampleComponent> = {
  title: 'Components/Chip Datepicker',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        importProvidersFrom(StorybookConfigurationLocalizationModule.forRoot()),
      ],
    }),
    moduleMetadata({
      imports: [BrowserAnimationsModule],
    }),
  ],
  component: ChipDatepickerExampleComponent,
};

export default meta;

const template = `<watt-chip-datepicker-example
  [exampleFormControlSingle]=exampleFormControlSingle
  [exampleFormControlRange]=exampleFormControlRange />`;

export const WithFormControl: StoryFn = (args) => ({
  props: {
    ...args,
    exampleFormControlSingle: new FormControl(null),
    exampleFormControlRange: new FormControl(null),
  },
  template,
});

WithFormControl.parameters = {
  docs: {
    source: {
      code: template,
    },
  },
};

export const WithValidations: StoryFn = (args) => ({
  props: {
    ...args,
    exampleFormControlSingle: new FormControl(null, Validators.required),
    exampleFormControlRange: new FormControl(null, WattRangeValidators.required()),
  },
  template,
});

export const WithInitialValue: StoryFn = (args) => ({
  props: {
    ...args,
    exampleFormControlSingle: new FormControl(initialValueRangeStart),
    exampleFormControlRange: new FormControl({
      start: initialValueRangeStart,
      end: initialValueRangeEnd_StartOfDay,
    }),
  },
  template,
});

export const WithFormControlDisabled: StoryFn = (args) => ({
  props: {
    ...args,
    exampleFormControlSingle: new FormControl({ value: null, disabled: true }),
    exampleFormControlRange: new FormControl({ value: null, disabled: true }),
  },
  template,
});
