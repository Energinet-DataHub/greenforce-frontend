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
  OnInit,
  Input,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { sub } from 'date-fns';
import { TranslocoModule } from '@ngneat/transloco';
import { zonedTimeToUtc } from 'date-fns-tz';

import {
  WattDatepickerModule,
  WattFormFieldModule,
  WattRangeValidators,
} from '@energinet-datahub/watt';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { BatchSearchDto } from '@energinet-datahub/dh/shared/domain';
import { Subject, takeUntil } from 'rxjs';

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
export class DhWholesaleFormComponent implements OnInit, OnDestroy {
  @Input() loading = false;
  @Output() search: EventEmitter<BatchSearchDto> = new EventEmitter();

  destroy$: Subject<void> = new Subject();

  searchForm = this.fb.group({
    executionTime: [
      {
        start: sub(new Date().setHours(0, 0, 0, 0), { days: 10 }).toISOString(),
        end: zonedTimeToUtc(
          new Date().setHours(0, 0, 0, 0),
          'Europe/Copenhagen'
        ).toISOString(),
      },
      WattRangeValidators.required(),
    ],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.onSubmit();
    this.searchForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.loading = false));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    if (!this.searchForm?.value?.executionTime) return;

    this.search.emit({
      minExecutionTime: this.searchForm?.value?.executionTime?.start as string,
      maxExecutionTime: this.searchForm?.value?.executionTime?.end as string,
    });
  }
}
