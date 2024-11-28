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
import { WattDateRangeField } from './watt-date-range-field.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { WattDateAdapter } from '../../configuration/watt-date-adapter';
import { signal } from '@angular/core';

const meta: Meta<WattDateRangeField> = {
  title: 'Components/DateRangeField',
  component: WattDateRangeField,
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

const period = new FormControl({ start: new Date('2024-11-20'), end: new Date() });
const min = signal(new Date('2024-11-20'));
const max = signal(new Date());

export const Overview: StoryFn = () => ({
  props: { period, min, max },
  template: `
    <watt-date-range-field
      label="Present time"
      [min]="min()"
      [max]="max()"
      [formControl]="period"
    />`,
});
