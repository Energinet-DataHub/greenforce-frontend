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
import {
  combineLatest,
  debounceTime,
  filter,
  map,
  Observable,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { WattDatepickerModule } from '@energinet-datahub/watt/datepicker';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { FilteredActorDto } from '@energinet-datahub/dh/shared/domain';
import { WattDropdownModule, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { PushModule } from '@rx-angular/template/push';
import { DhWholesaleBatchDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { SettlementReportFilters } from '@energinet-datahub/dh/wholesale/domain';
import { graphql } from '@energinet-datahub/dh/shared/domain';

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
  @Input() set executionTime(executionTime: { start: string; end: string }) {
    this.filters.patchValue({ executionTime });
  }
  @Output() filterChange = new EventEmitter<SettlementReportFilters>();

  private destroy$ = new Subject<void>();
  private transloco = inject(TranslocoService);
  private store = inject(DhWholesaleBatchDataAccessApiStore);
  private fb = inject(FormBuilder);

  processTypeOptions$: Observable<WattDropdownOption[]> = this.transloco
    .selectTranslateObject('wholesale.settlementReports.processTypes')
    .pipe(
      map((translations) => {
        return Object.entries(graphql.ProcessType).map(([, value]) => ({
          value: value,
          displayValue: translations[value],
        }));
      })
    );

  actors: FilteredActorDto[] = [
    {
      actorId: '10',
      actorNumber: {
        value: '1',
      },
      name: {
        value: 'Actor (805)',
      },
      marketRoles: [],
      gridAreaCodes: ['805'],
    },
    {
      actorId: '20',
      actorNumber: {
        value: '1',
      },
      name: {
        value: 'Actor (806)',
      },
      marketRoles: [],
      gridAreaCodes: ['806'],
    },
    {
      actorId: '30',
      actorNumber: {
        value: '1',
      },
      name: {
        value: 'Actor (805, 806)',
      },
      marketRoles: [],
      gridAreaCodes: ['805', '806'],
    },
  ];

  actorOptions: WattDropdownOption[] = this.actors.map((actor) => {
    return {
      displayValue: actor.name.value,
      value: actor.actorId,
    };
  });

  filters = this.fb.group({
    processType: [''],
    gridAreas: [['']],
    period: [
      {
        start: '',
        end: '',
      },
    ],
    executionTime: [
      {
        start: '',
        end: '',
      },
      WattRangeValidators.required(),
    ],
    actor: [''],
  });

  gridAreaOptions$: Observable<WattDropdownOption[]> = combineLatest([
    this.store.gridAreas$.pipe(exists()),
    this.filters.controls.actor.valueChanges.pipe(startWith(null))
  ]).pipe(
    map(([gridAreas, selectedActorId]) => {
      const selectedActor = this.actors.find((x) => x.actorId === selectedActorId);
      this.filters.patchValue({ gridAreas: selectedActor?.gridAreaCodes });

      return gridAreas
        .filter((gridArea) => {
          if (!selectedActor) return true;
          return selectedActor.gridAreaCodes.includes(gridArea.code);
        })
        .map((gridArea) => ({
          value: gridArea.code,
          displayValue: `${gridArea.name} (${gridArea.code})`,
        }));
    })
  );

  private isComplete(filters: SettlementReportFilters) {
    return (
      Boolean(filters.period?.start) === Boolean(filters.period?.end) &&
      Boolean(filters.executionTime?.start) === Boolean(filters.executionTime?.end)
    );
  }

  ngAfterViewInit() {
    this.filters.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(200), filter(this.isComplete))
      .subscribe((filters: SettlementReportFilters) => {
        this.filterChange.emit(filters as SettlementReportFilters);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
