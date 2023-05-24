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
  OnInit,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Apollo } from 'apollo-angular';

import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { WattDatepickerModule } from '@energinet-datahub/watt/datepicker';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { PushModule } from '@rx-angular/template/push';
import { ActorFilter, SettlementReportFilters } from '@energinet-datahub/dh/wholesale/domain';
import { graphql } from '@energinet-datahub/dh/shared/domain';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    WattButtonComponent,
    WattDatepickerModule,
    WATT_FORM_FIELD,
    WattDropdownComponent,
    PushModule,
  ],
  selector: 'dh-wholesale-form',
  templateUrl: './dh-wholesale-form.component.html',
  styleUrls: ['./dh-wholesale-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhWholesaleFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() loading = false;
  @Input() set executionTime(executionTime: { start: string; end: string }) {
    this.filters.patchValue({ executionTime });
  }
  @Output() filterChange = new EventEmitter<SettlementReportFilters>();

  private destroy$ = new Subject<void>();
  private transloco = inject(TranslocoService);
  private apollo = inject(Apollo);
  private fb = inject(FormBuilder);

  actorsQuery = this.apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: graphql.GetActorFilterDocument,
  });

  gridAreasQuery = this.apollo.watchQuery({
    query: graphql.GetGridAreasDocument,
  });

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

  actors!: ActorFilter;

  filters = this.fb.group({
    processTypes: [[]],
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
    actor: [{ value: '', disabled: true }],
  });

  gridAreaOptions$: Observable<WattDropdownOption[]> = combineLatest([
    this.gridAreasQuery.valueChanges.pipe(map((result) => result.data?.gridAreas ?? [])),
    this.filters.controls.actor.valueChanges.pipe(startWith(null)),
  ]).pipe(
    map(([gridAreas, selectedActorId]) => {
      const selectedActor = this.actors?.find((x) => x.value === selectedActorId);
      this.filters.patchValue({ gridAreas: selectedActor?.gridAreaCodes || null });

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

  ngOnInit() {
    this.actorsQuery.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        this.actors = result.data?.actors ?? [];
        if (!result.loading) this.filters.controls.actor.enable();
      },
    });
  }

  ngAfterViewInit() {
    this.filters.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((a, b) => {
          // We need the raw values object, as disabled form fields won't be part of the valuesChanges otherwise.
          const rawValues = this.filters.getRawValue();
          return JSON.stringify({ ...rawValues, ...a }) === JSON.stringify({ ...rawValues, ...b });
        }),
        debounceTime(200),
        filter(this.isComplete)
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe((filters: any) => {
        if (!filters.gridAreas && filters.actor) {
          this.filters.controls.actor.reset();
          return;
        }

        this.filterChange.emit({
          ...filters,
          actor: this.actors?.find((x) => x.value === filters.actor),
        } as SettlementReportFilters);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
