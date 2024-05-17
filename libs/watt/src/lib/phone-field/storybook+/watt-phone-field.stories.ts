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
import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';

import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  WattFieldComponent,
  WattFieldErrorComponent,
  WattFieldHintComponent,
} from '@energinet-datahub/watt/field';

import { WattPhoneFieldComponent } from '../watt-phone-field.component';

const meta: Meta<WattPhoneFieldComponent> = {
  title: 'Components/Phone Field',
  component: WattPhoneFieldComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        WattFieldComponent,
        WattFieldErrorComponent,
        WattFieldHintComponent,
      ],
    }),
    applicationConfig({
      providers: [provideAnimations(), importProvidersFrom(HttpClientModule)],
    }),
  ],
};

export default meta;

export const Default: StoryFn<WattPhoneFieldComponent> = () => ({
  props: {
    label: 'Phone number',
    exampleFormControl: new FormControl(null),
  },
  template: `<watt-phone-field [label]="label" [formControl]="exampleFormControl" />`,
});

export const WithRequired: StoryFn<WattPhoneFieldComponent> = () => ({
  props: {
    label: 'Required Phone number',
    exampleFormControl: new FormControl(null, Validators.required),
  },
  template: `<watt-phone-field [label]="label" [formControl]="exampleFormControl" />`,
});

export const WithValue: StoryFn<WattPhoneFieldComponent> = () => ({
  props: {
    label: 'With Phone number',
    exampleFormControl: new FormControl('+49 25242322'),
  },
  template: `<watt-phone-field [label]="label" [formControl]="exampleFormControl" />`,
});

export const WithHint: StoryFn<WattPhoneFieldComponent> = () => ({
  props: {
    label: 'Phone number with hint',
    exampleFormControl: new FormControl(null, Validators.required),
  },
  template: `<watt-phone-field [label]="label" [formControl]="exampleFormControl">
              <watt-field-hint>This is a hint</watt-field-hint>
            </watt-phone-field>`,
});
