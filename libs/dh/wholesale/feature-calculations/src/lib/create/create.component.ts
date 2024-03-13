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
import { Component, DestroyRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';
import { combineLatest, first, map, Observable, of, startWith, Subject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattFieldErrorComponent, WattFieldHintComponent } from '@energinet-datahub/watt/field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDatepickerV2Component } from '@energinet-datahub/watt/datepicker';
import { WattDatePipe, WattDateRange, dayjs } from '@energinet-datahub/watt/date';
import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattFilterChipComponent } from '@energinet-datahub/watt/chip';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import {
  CreateCalculationDocument,
  GetGridAreasDocument,
  GetLatestBalanceFixingDocument,
  CalculationType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  filterValidGridAreas,
  GridArea,
  calculationTypes,
} from '@energinet-datahub/dh/wholesale/domain';

interface FormValues {
  calculationType: FormControl<CalculationType>;
  gridAreas: FormControl<string[] | null>;
  dateRange: FormControl<WattDateRange | null>;
}

@Component({
  selector: 'dh-calculations-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    RxLet,
    RxPush,
    ReactiveFormsModule,
    TranslocoModule,
    WATT_MODAL,
    WattButtonComponent,
    WattDatepickerV2Component,
    WattDatePipe,
    WattDropdownComponent,
    WattEmptyStateComponent,
    WattFilterChipComponent,
    WattSpinnerComponent,
    WattValidationMessageComponent,
    WattFieldErrorComponent,
    WattFieldHintComponent,
    WattTextFieldComponent,
  ],
})
export class DhCalculationsCreateComponent implements OnInit, OnDestroy {
  private _toast = inject(WattToastService);
  private _transloco = inject(TranslocoService);
  private _router = inject(Router);
  private _apollo = inject(Apollo);
  private _destroyRef = inject(DestroyRef);

  private executionTypeChanged_$ = new Subject<void>();

  @ViewChild('modal') modal?: WattModalComponent;

  loading = false;

  confirmFormControl = new FormControl('');

  monthOnly = [
    CalculationType.WholesaleFixing,
    CalculationType.FirstCorrectionSettlement,
    CalculationType.SecondCorrectionSettlement,
    CalculationType.ThirdCorrectionSettlement,
  ];

  formGroup = new FormGroup<FormValues>({
    calculationType: new FormControl<CalculationType>(CalculationType.BalanceFixing, {
      nonNullable: true,
      validators: Validators.required,
    }),
    gridAreas: new FormControl(
      { value: null, disabled: true },
      { validators: Validators.required }
    ),
    dateRange: new FormControl(null, {
      validators: WattRangeValidators.required(),
      asyncValidators: () => this.validateBalanceFixing(),
    }),
  });

  gridAreasQuery = this._apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: GetGridAreasDocument,
  });

  onDateRangeChange$ = this.formGroup.controls.dateRange.valueChanges.pipe(startWith(null));

  calculationTypes: Observable<WattDropdownOption[]> = this._transloco
    .selectTranslateObject('wholesale.calculations.calculationTypes')
    .pipe(
      map((translations) =>
        calculationTypes.map((calculationType) => ({
          displayValue: this._transloco.translate(
            translations[calculationType].replace(/{{|}}/g, '')
          ),
          value: calculationType,
        }))
      )
    );

  selectedExecutionType = 'ACTUAL';
  latestPeriodEnd?: Date | null;
  showPeriodWarning = false;

  gridAreas$: Observable<WattDropdownOption[]> = combineLatest([
    this.gridAreasQuery.valueChanges.pipe(map((result) => result.data?.gridAreas ?? [])),
    this.onDateRangeChange$,
    this.executionTypeChanged_$.pipe(startWith('')),
  ]).pipe(
    map(([gridAreas, dateRange]) => filterValidGridAreas(gridAreas, dateRange)),
    map((gridAreas) => {
      this.setMinDate(gridAreas);
      this.validatePeriod(gridAreas);
      return this.mapGridAreasToDropdownOptions(gridAreas);
    }),
    tap((gridAreas) => this.selectGridAreas(gridAreas))
  );

  minDate: Date | null = null;
  maxDate = new Date();

  ngOnInit(): void {
    this.toggleGridAreasControl();

    // Close toast on navigation
    this._router.events.pipe(first((event) => event instanceof NavigationEnd)).subscribe(() => {
      this._toast.dismiss();
    });
  }

  ngOnDestroy(): void {
    this.executionTypeChanged_$.complete();
  }

  onExecutionTypeSelected(selection: HTMLInputElement) {
    this.selectedExecutionType = selection.value;
    this.executionTypeChanged_$.next();
  }

  open() {
    this.modal?.open();
  }

  createCalculation() {
    const { calculationType, gridAreas, dateRange } = this.formGroup.getRawValue();

    if (
      this.formGroup.invalid ||
      gridAreas === null ||
      dateRange === null ||
      calculationType === null
    )
      return;

    this._apollo
      .mutate({
        useMutationLoading: true,
        mutation: CreateCalculationDocument,
        variables: {
          input: {
            gridAreaCodes: gridAreas,
            period: { start: dayjs(dateRange.start).toDate(), end: dayjs(dateRange.end).toDate() },
            calculationType: calculationType,
          },
        },
      })
      .subscribe({
        next: (result) => {
          // Update loading state of button
          this.loading = result.loading;

          if (result.loading) {
            this._toast.open({
              type: 'loading',
              message: this._transloco.translate('wholesale.calculations.create.toast.loading'),
            });
          } else if (result.errors) {
            this._toast.update({
              type: 'danger',
              message: this._transloco.translate('wholesale.calculations.create.toast.error'),
            });
          } else {
            this._toast.update({
              type: 'success',
              message: this._transloco.translate('wholesale.calculations.create.toast.success'),
            });
          }
        },
        error: () => {
          this._toast.update({
            type: 'danger',
            message: this._transloco.translate('wholesale.calculations.create.toast.error'),
          });
        },
      });
  }

  onClose(accepted: boolean) {
    if (accepted) this.createCalculation();
    if (accepted || this.showPeriodWarning) this.reset();

    this.confirmFormControl.reset();
  }

  reset() {
    this.latestPeriodEnd = null;
    this.showPeriodWarning = false;
    this.formGroup.reset();

    // This is apparently neccessary to reset the dropdown validity state
    this.formGroup.controls.calculationType.setErrors(null);
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
    this.onDateRangeChange$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
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
    return this._apollo
      .query({
        query: GetLatestBalanceFixingDocument,
        fetchPolicy: 'network-only',
        variables: {
          period: {
            end: dayjs(dateRange.value.end).toDate(),
            start: dayjs(dateRange.value.start).toDate(),
          },
        },
      })
      .pipe(
        tap((result) => (this.latestPeriodEnd = result.data?.calculations?.[0]?.period?.end)),
        map(() => null)
      );
  }
}
