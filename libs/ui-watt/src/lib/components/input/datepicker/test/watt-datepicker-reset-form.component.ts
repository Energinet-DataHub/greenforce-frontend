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
import { Component } from '@angular/core';
import { WattButtonModule } from '../../../button';
import { WattDatepickerModule, WattRange } from '../';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

const buildForm = () => {
  return new FormGroup({
    dateRange: new FormControl<WattRange>({
      start: '',
      end: '',
    }),
  });
};

@Component({
  standalone: true,
  templateUrl: './watt-datepicker-reset-form.component.html',
  selector: 'watt-datepicker-reset-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    WattDatepickerModule,
    WattButtonModule,
  ],
})
export class WattDatepickerResetFormComponent {
  formGroup: FormGroup = buildForm();
  resetForm() {
    this.formGroup = buildForm();
  }
}
