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
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';

import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattInputDirective } from '@energinet-datahub/watt/input';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    WattButtonComponent,
    WattDatepickerComponent,
    WATT_FORM_FIELD,
    WattInputDirective,
  ],
  selector: 'dh-wholesale-form',
  templateUrl: './dh-wholesale-form.component.html',
  styleUrls: ['./dh-wholesale-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhWholesaleFormComponent {
  @Input() loading = false;
  @Input() set executionTime(executionTime: { start: string; end: string }) {
    this.searchForm.patchValue({ executionTime });
  }

  @Output() search = new EventEmitter<{
    executionTime: { start: string; end: string };
    startedBy: string;
  }>();

  searchForm = this.fb.nonNullable.group({
    executionTime: [this.executionTime, WattRangeValidators.required()],
    startedBy: '',
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.searchForm.invalid) {
      return;
    }

    this.search.emit(this.searchForm.getRawValue());
  }
}
