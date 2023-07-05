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
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template/let';
import { PushModule } from '@rx-angular/template/push';
import {
  combineLatest,
  first,
  map,
  Observable,
  of,
  startWith,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattFilterChipComponent } from '@energinet-datahub/watt/chip';
import { WattInputDirective } from '@energinet-datahub/watt/input';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';

import { DateRange } from '@energinet-datahub/dh/shared/domain';
import {
  CreateCalculationDocument,
  GetGridAreasDocument,
  GetLatestBalanceFixingDocument,
  ProcessType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { filterValidGridAreas, GridArea } from '@energinet-datahub/dh/wholesale/domain';

interface FormValues {
  processType: FormControl<ProcessType | null>;
  gridAreas: FormControl<string[] | null>;
  dateRange: FormControl<DateRange | null>;
}

// List of supported process types
const processTypes = ['BALANCE_FIXING', 'AGGREGATION'];

@Component({
  selector: 'dh-calculations-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    LetModule,
    PushModule,
    ReactiveFormsModule,
    TranslocoModule,
    WATT_FORM_FIELD,
    WATT_MODAL,
    WattButtonComponent,
    WattDatepickerComponent,
    WattDatePipe,
    WattDropdownComponent,
    WattEmptyStateComponent,
    WattFilterChipComponent,
    WattInputDirective,
    WattSpinnerComponent,
    WattValidationMessageComponent,
  ],
})
export class DhCalculationsCreateComponent implements OnInit, OnDestroy {
  private toast = inject(WattToastService);
  private transloco = inject(TranslocoService);
  private router = inject(Router);
  private apollo = inject(Apollo);

  private executionTypeChanged$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  @ViewChild('modal') modal?: WattModalComponent;

  loading = false;

  confirmFormControl = new FormControl(null);

  formGroup = new FormGroup<FormValues>({
    processType: new FormControl(null, { validators: Validators.required }),
    gridAreas: new FormControl(
      { value: null, disabled: true },
      { validators: Validators.required }
    ),
    dateRange: new FormControl(null, {
      validators: WattRangeValidators.required(),
      asyncValidators: () => this.validateBalanceFixing(),
    }),
  });

  gridAreasQuery = this.apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: GetGridAreasDocument,
  });

  onDateRangeChange$ = this.formGroup.controls.dateRange.valueChanges.pipe(startWith(null));

  processTypes: Observable<WattDropdownOption[]> = this.transloco
    .selectTranslateObject('wholesale.calculations.processTypes')
    .pipe(map((t) => processTypes.map((value) => ({ displayValue: t[value], value }))));

  selectedExecutionType = 'ACTUAL';
  latestPeriodEnd?: string | null;
  showPeriodWarning = false;

  gridAreas$: Observable<WattDropdownOption[]> = combineLatest([
    this.gridAreasQuery.valueChanges.pipe(map((result) => result.data?.gridAreas ?? [])),
    this.onDateRangeChange$,
    this.executionTypeChanged$.pipe(startWith('')),
  ]).pipe(
    map(([gridAreas, dateRange]) => filterValidGridAreas(gridAreas, dateRange)),
    map((gridAreas) => {
      this.setMinDate(gridAreas);
      this.validatePeriod(gridAreas);
      return this.mapGridAreasToDropdownOptions(gridAreas);
    }),
    tap((gridAreas) => this.selectGridAreas(gridAreas))
  );

  minDate?: Date;
  maxDate = new Date();

  ngOnInit(): void {
    this.toggleGridAreasControl();

    // Close toast on navigation
    this.router.events.pipe(first((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.toast.dismiss();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.executionTypeChanged$.complete();
  }

  onExecutionTypeSelected(selection: HTMLInputElement) {
    this.selectedExecutionType = selection.value;
    this.executionTypeChanged$.next();
  }

  open() {
    this.modal?.open();
  }

  createCalculation() {
    const { processType, gridAreas, dateRange } = this.formGroup.getRawValue();

    if (this.formGroup.invalid || gridAreas === null || dateRange === null || processType === null)
      return;

    this.apollo
      .mutate({
        useMutationLoading: true,
        mutation: CreateCalculationDocument,
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
          this.loading = result.loading;

          if (result.loading) {
            this.toast.open({
              type: 'loading',
              message: this.transloco.translate('wholesale.calculations.create.toast.loading'),
            });
          } else if (result.errors) {
            this.toast.update({
              type: 'danger',
              message: this.transloco.translate('wholesale.calculations.create.toast.error'),
            });
          } else {
            this.toast.update({
              type: 'success',
              message: this.transloco.translate('wholesale.calculations.create.toast.success'),
            });
          }
        },
        error: () => {
          this.toast.update({
            type: 'danger',
            message: this.transloco.translate('wholesale.calculations.create.toast.error'),
          });
        },
      });
  }

  onClose(accepted: boolean) {
    if (accepted) this.createCalculation();
    if (accepted || this.showPeriodWarning) this.reset();
  }

  reset() {
    this.latestPeriodEnd = null;
    this.showPeriodWarning = false;
    this.formGroup.reset();

    // This is apparently neccessary to reset the dropdown validity state
    this.formGroup.controls.processType.setErrors(null);
  }

  private selectGridAreas(gridAreas: WattDropdownOption[]) {
    if (this.selectedExecutionType === 'ACTUAL') {
      this.formGroup.patchValue({
        gridAreas: gridAreas.map((gridArea) => gridArea.value),
      });
    } else {
      this.formGroup.patchValue({
        gridAreas: [],
      });
    }
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
      const gridAreasControl = this.formGroup.controls.gridAreas;
      const disableGridAreas = this.formGroup.controls.dateRange.invalid;
      if (disableGridAreas == gridAreasControl.disabled) return; // prevent ng0100
      disableGridAreas ? gridAreasControl.disable() : gridAreasControl.enable();
    });
  }

  private validatePeriod(gridAreas: GridArea[]) {
    if (gridAreas.length === 0) {
      this.formGroup.controls.dateRange.setErrors({
        ...this.formGroup.controls.dateRange.errors,
        invalidPeriod: true,
      });
    }
  }

  private validateBalanceFixing(): Observable<null> {
    const { dateRange } = this.formGroup.controls;

    // Hide warning initially
    this.latestPeriodEnd = null;

    // Skip validation if end and start is not set
    if (!dateRange.value?.end || !dateRange.value?.start) return of(null);

    // This observable always returns null (no error)
    return this.apollo
      .query({
        query: GetLatestBalanceFixingDocument,
        fetchPolicy: 'network-only',
        variables: {
          period: {
            end: dateRange.value.end,
            start: dateRange.value.start,
          },
        },
      })
      .pipe(
        tap((result) => (this.latestPeriodEnd = result.data?.calculations?.[0]?.period?.end)),
        map(() => null)
      );
  }
}
