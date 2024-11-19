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

const destination = new FormControl(new Date(1985, 9, 26, 1, 21));
const present = new FormControl(new Date(2021, 10, 12, 1, 22));
const lastDeparted = new FormControl(new Date(2015, 9, 21, 1, 21));

export const Overview: StoryFn = () => ({
  props: { destination, present, lastDeparted },
  template: `
    <watt-datetime-field label="Destination time" [formControl]="destination" />
    <watt-datetime-field label="Present time" [formControl]="present" />
    <watt-datetime-field label="Last time departed" [formControl]="lastDeparted" />`,
});
