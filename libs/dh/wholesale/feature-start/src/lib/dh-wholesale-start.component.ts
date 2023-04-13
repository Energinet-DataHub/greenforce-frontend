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
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { combineLatest, first, map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template/let';
import { PushModule } from '@rx-angular/template/push';

import { WattDropdownModule, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattDatepickerModule } from '@energinet-datahub/watt/datepicker';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';
import { DateRange } from '@energinet-datahub/dh/shared/domain';
import { filterValidGridAreas, GridArea } from '@energinet-datahub/dh/wholesale/domain';
import { graphql } from '@energinet-datahub/dh/shared/domain';

interface CreateBatchFormValues {
  processType: FormControl<graphql.ProcessType | null>;
  gridAreas: FormControl<string[] | null>;
  dateRange: FormControl<DateRange | null>;
}

@Component({
  selector: 'dh-wholesale-start',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-wholesale-start.component.html',
  styleUrls: ['./dh-wholesale-start.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DhFeatureFlagDirectiveModule,
    LetModule,
    PushModule,
    ReactiveFormsModule,
    TranslocoModule,
    WattButtonModule,
    WattDatepickerModule,
    WattDropdownModule,
    WattFormFieldModule,
    WattSpinnerModule,
    WattEmptyStateModule,
  ],
})
export class DhWholesaleStartComponent implements OnInit, OnDestroy {
  private toast = inject(WattToastService);
  private transloco = inject(TranslocoService);
  private router = inject(Router);
  private apollo = inject(Apollo);

  private destroy$ = new Subject<void>();

  loadingCreateBatch = false;

  createBatchForm = new FormGroup<CreateBatchFormValues>({
    processType: new FormControl(null, { validators: Validators.required }),
    gridAreas: new FormControl(null, { validators: Validators.required }),
    dateRange: new FormControl(null, {
      validators: WattRangeValidators.required(),
    }),
  });

  gridAreasQuery = this.apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: graphql.GetGridAreasDocument,
  });

  onDateRangeChange$ = this.createBatchForm.controls.dateRange.valueChanges.pipe(startWith(null));

  processTypes: WattDropdownOption[] = [];

  gridAreas$: Observable<WattDropdownOption[]> = combineLatest([
    this.gridAreasQuery.valueChanges.pipe(map((result) => result.data?.gridAreas ?? [])),
    this.onDateRangeChange$,
  ]).pipe(
    map(([gridAreas, dateRange]) => filterValidGridAreas(gridAreas, dateRange)),
    map((gridAreas) => {
      this.setMinDate(gridAreas);
      this.validatePeriod(gridAreas);
      return this.mapGridAreasToDropdownOptions(gridAreas);
    })
  );

  minDate?: Date;
  maxDate = new Date();

  ngOnInit(): void {
    this.getProcessTypes();
    this.toggleGridAreasControl();

    // Close toast on navigation
    this.router.events.pipe(first((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.toast.dismiss();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getProcessTypes(): void {
    this.transloco
      .selectTranslateObject('wholesale.startBatch.processTypes')
      .pipe(takeUntil(this.destroy$))
      .subscribe((processTypesTranslation) => {
        this.processTypes = Object.values(graphql.ProcessType).map((value) => ({
          displayValue: processTypesTranslation[value],
          value,
        }));
      });
  }

  createBatch() {
    const { processType, gridAreas, dateRange } = this.createBatchForm.getRawValue();
    if (
      this.createBatchForm.invalid ||
      gridAreas === null ||
      dateRange === null ||
      processType === null
    )
      return;

    this.apollo
      .mutate({
        useMutationLoading: true,
        mutation: graphql.CreateBatchDocument,
        variables: {
          input: {
            gridAreaCodes: gridAreas,
            period: dateRange,
            processType: processType,
          },
        },
      })
      .subscribe({
        next: (result) => {
          // Update loading state of button
          this.loadingCreateBatch = result.loading;

          if (result.loading) {
            this.toast.open({
              type: 'loading',
              message: this.transloco.translate('wholesale.startBatch.creatingBatch'),
            });
          } else if (result.errors) {
            this.toast.update({
              type: 'danger',
              message: this.transloco.translate('shared.error.title'),
            });
          } else {
            this.toast.update({
              type: 'success',
              message: this.transloco.translate('wholesale.startBatch.creatingBatchSuccess'),
            });
          }
        },
        error: () => {
          this.toast.update({
            type: 'danger',
            message: this.transloco.translate('shared.error.title'),
          });
        },
      });
  }

  private setMinDate(gridAreas: GridArea[]) {
    if (gridAreas.length === 0) return;
    const validFromDates: number[] = gridAreas.map((gridArea) => {
      return new Date(gridArea.validFrom).getTime();
    });
    this.minDate = new Date(Math.min(...validFromDates));
  }

  private mapGridAreasToDropdownOptions(gridAreas: GridArea[]): WattDropdownOption[] {
    return (
      gridAreas.map((gridArea) => {
        return {
          displayValue: `${gridArea?.name} (${gridArea?.code})`,
          value: gridArea?.code,
        };
      }) || []
    );
  }

  private toggleGridAreasControl() {
    // Disable grid areas when date range is invalid
    this.onDateRangeChange$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const gridAreasControl = this.createBatchForm.controls.gridAreas;
      const disableGridAreas = this.createBatchForm.controls.dateRange.invalid;

      disableGridAreas ? gridAreasControl.disable() : gridAreasControl.enable();
    });
  }

  private validatePeriod(gridAreas: GridArea[]) {
    if (gridAreas.length === 0) {
      this.createBatchForm.controls.dateRange.setErrors({
        ...this.createBatchForm.controls.dateRange.errors,
        invalidPeriod: true,
      });
    }
  }
}
