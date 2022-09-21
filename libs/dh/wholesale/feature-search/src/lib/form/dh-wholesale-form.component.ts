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
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import {
  WattButtonModule,
  WattDatepickerModule,
  WattFormFieldModule,
  WattRangeValidators,
} from '@energinet-datahub/watt';

import { WholesaleSearchBatchDto } from '@energinet-datahub/dh/shared/domain';
import { format, sub } from 'date-fns';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    WattButtonModule,
    WattDatepickerModule,
    WattFormFieldModule,
  ],
  selector: 'dh-wholesale-form',
  templateUrl: './dh-wholesale-form.component.html',
  styleUrls: ['./dh-wholesale-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhWholesaleFormComponent {
  @Output() search: EventEmitter<WholesaleSearchBatchDto> = new EventEmitter();

  searchForm = this.fb.group({
    executionTime: [
      {
        start: format(new Date(), 'dd-MM-yyyy'),
        end: format(sub(new Date(), { days: 14 }), 'dd-MM-yyyy'),
      },
      WattRangeValidators.required(),
    ],
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    this.search.emit({
      minExecutionTime: this.searchForm?.value?.executionTime?.start as string,
      maxExecutionTime: this.searchForm?.value?.executionTime?.end as string,
    });
  }
}
