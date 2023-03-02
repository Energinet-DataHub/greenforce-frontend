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
  AfterViewInit,
  Input,
  inject,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { sub } from 'date-fns';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { WattDatepickerModule } from '@energinet-datahub/watt/datepicker';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { ProcessType } from '@energinet-datahub/dh/shared/domain';
import { WattDropdownModule, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { PushModule } from '@rx-angular/template/push';
import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { SettlementReportFilters } from '@energinet-datahub/dh/wholesale/domain';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    WattButtonModule,
    WattDatepickerModule,
    WattFormFieldModule,
    WattDropdownModule,
    PushModule,
  ],
  providers: [DhWholesaleBatchDataAccessApiStore],
  selector: 'dh-wholesale-form',
  templateUrl: './dh-wholesale-form.component.html',
  styleUrls: ['./dh-wholesale-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhWholesaleFormComponent implements AfterViewInit, OnDestroy {
  @Input() loading = false;
  @Output() filterChange = new EventEmitter<SettlementReportFilters>();

  private destroy$ = new Subject<void>();
  private transloco = inject(TranslocoService);
  private store = inject(DhWholesaleBatchDataAccessApiStore);

  processTypeOptions$: Observable<WattDropdownOption[]> = this.transloco
    .selectTranslateObject('wholesale.settlementReports.processTypes')
    .pipe(
      map((translations) => {
        return [
          {
            value: ProcessType.BalanceFixing,
            displayValue: translations[ProcessType.BalanceFixing],
          },
        ];
      })
    );

  gridAreaOptions$: Observable<WattDropdownOption[]> = this.store.gridAreas$.pipe(
    exists(),
    map((gridAreas) => {
      return gridAreas.map((gridArea) => ({
        value: gridArea.code,
        displayValue: `${gridArea.name} (${gridArea.code})`,
      }));
    })
  );

  filters = this.fb.group({
    processType: [''],
    gridArea: [''],
    period: [
      {
        value: {
          start: '',
          end: '',
        },
      },
    ],
    executionTime: [
      {
        start: sub(new Date().setHours(0, 0, 0, 0), { days: 10 }).toISOString(),
        end: new Date().toISOString(),
      },
      WattRangeValidators.required(),
    ],
  });

  constructor(private fb: FormBuilder) {}

  ngAfterViewInit() {
    this.filters.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((filters: unknown) => {
      this.filterChange.emit(filters as SettlementReportFilters);
    });

    this.filterChange.emit(this.filters.value as SettlementReportFilters);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
