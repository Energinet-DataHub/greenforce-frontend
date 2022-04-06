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
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MatDateFnsModule,
  DateFnsAdapter,
  MAT_DATE_FNS_FORMATS,
} from '@angular/material-date-fns-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgModule } from '@angular/core';
import * as daLocale from 'date-fns/locale/da/index.js';

import { WattDateRangeInputComponent } from './date-range-input.component';
import { WattFormFieldModule } from '../form-field/form-field.module';

@NgModule({
  imports: [MatDatepickerModule, MatDateFnsModule, WattFormFieldModule],
  declarations: [WattDateRangeInputComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: daLocale },
    {
      provide: DateAdapter,
      useClass: DateFnsAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FNS_FORMATS },
  ],
  exports: [WattDateRangeInputComponent, WattFormFieldModule],
})
export class WattDateRangeInputModule {}
