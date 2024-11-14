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
import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { WattDateTimeField } from './watt-datetime-field.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { WattDateAdapter } from '../../configuration/watt-date-adapter';

const meta: Meta<WattDateTimeField> = {
  title: 'Components/DateTime',
  component: WattDateTimeField,
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule],
    }),
    applicationConfig({
      providers: [
        { provide: DateAdapter, useClass: WattDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
      ],
    }),
  ],
};

export default meta;

const control = new FormControl(new Date());
control.valueChanges.subscribe((value) => console.log(value));

export const Overview: StoryFn = () => ({
  props: { formControl: control },
  template: `
    <watt-datetime-field [formControl]="formControl" [inclusive]="true" />
    <button (click)="formControl.reset()">Reset</button>
    <button (click)="formControl.disable()">Disable</button>
    <button (click)="formControl.enable()">Enable</button>
    <p>Value: {{ formControl.value?.toISOString() }}</p>`,
});
