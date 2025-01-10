//#region License
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
//#endregion
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { WattDateTimeField } from './watt-datetime-field.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { WattDateAdapter } from '../../configuration/watt-date-adapter';
import { signal } from '@angular/core';

const meta: Meta<WattDateTimeField> = {
  title: 'Components/DateTimeField',
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

const destination = new FormControl<Date | null>(null);
const present = new FormControl(new Date());
const lastDeparted = new FormControl<Date | null>({ value: null, disabled: true });
const min = signal(new Date());
const max = signal(new Date());
const flux = (destination: Date | null) => {
  if (!destination) return;
  lastDeparted.setValue(present.value);
  min.set(destination);
  max.set(destination);
  setTimeout(() => present.setValue(destination));
};

export const Overview: StoryFn = () => ({
  props: { destination, present, lastDeparted, min, max, flux },
  template: `
    <watt-datetime-field
      label="Destination time"
      [formControl]="destination"
      (dateChange)="flux($event)"
    />
    <watt-datetime-field
      label="Present time"
      [min]="min()"
      [max]="max()"
      [formControl]="present"
    />
    <watt-datetime-field
      label="Last time departed"
      [formControl]="lastDeparted"
      [inclusive]="true"
    />`,
});
