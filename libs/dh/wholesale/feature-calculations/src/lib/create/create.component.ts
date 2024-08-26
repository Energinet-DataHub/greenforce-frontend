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
import { Component, computed, inject, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';
import { first, map, Observable, of, tap } from 'rxjs';

import {
  WattFieldComponent,
  WattFieldErrorComponent,
  WattFieldHintComponent,
} from '@energinet-datahub/watt/field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WattDatetimepickerComponent } from '@energinet-datahub/watt/datetimepicker';
import { WattDatePipe, dayjs } from '@energinet-datahub/watt/date';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattFilterChipComponent } from '@energinet-datahub/watt/chip';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';
import { WattRadioComponent } from '@energinet-datahub/watt/radio';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { DhFeatureFlagsService } from '@energinet-datahub/dh/shared/feature-flags';
import { dhAppEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import { Range } from '@energinet-datahub/dh/shared/domain';
import {
  CalculationType,
  CreateCalculationDocument,
  GetLatestBalanceFixingDocument,
  StartCalculationType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { getMinDate } from '@energinet-datahub/dh/wholesale/domain';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { DhCalculationsGridAreasDropdownComponent } from '../grid-areas/dropdown.component';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { toSignal } from '@angular/core/rxjs-interop';

interface FormValues {
  isInternal: FormControl<boolean | null>;
  calculationType: FormControl<StartCalculationType>;
  gridAreas: FormControl<string[] | null>;
  dateRange: FormControl<Range<string> | null>;
  isScheduled: FormControl<boolean>;
  scheduledAt: FormControl<Date | null>;
}

@Component({
  selector: 'dh-calculations-create',
  templateUrl: './create.component.html',
  standalone: true,
  imports: [
    RxLet,
    RxPush,
    ReactiveFormsModule,
    TranslocoDirective,

    WATT_MODAL,
    WattButtonComponent,
    WattDatePipe,
    WattDatepickerComponent,
    WattDatetimepickerComponent,
    WattDropdownComponent,
    WattEmptyStateComponent,
    WattFieldComponent,
    WattFilterChipComponent,
    WattSpinnerComponent,
    WattValidationMessageComponent,
    WattFieldErrorComponent,
    WattFieldHintComponent,
    WattRadioComponent,
    WattTextFieldComponent,

    VaterFlexComponent,
    VaterStackComponent,

    DhCalculationsGridAreasDropdownComponent,
    DhDropdownTranslatorDirective,
  ],
})
export class DhCalculationsCreateComponent implements OnInit {
  CalculationType = StartCalculationType;

  private _toast = inject(WattToastService);
  private _transloco = inject(TranslocoService);
  private _router = inject(Router);
  private _apollo = inject(Apollo);

  @ViewChild('modal') modal?: WattModalComponent;

  ffs = inject(DhFeatureFlagsService);

  environment = inject(dhAppEnvironmentToken);

  resolutionTransitionDate = this.ffs.isEnabled('quarterly-resolution-transition-datetime-override')
    ? '2023-01-31T23:00:00Z'
    : '2023-04-30T22:00:00Z';

  loading = false;

  confirmFormControl = new FormControl('');

  monthOnly = [
    StartCalculationType.WholesaleFixing,
    StartCalculationType.FirstCorrectionSettlement,
    StartCalculationType.SecondCorrectionSettlement,
    StartCalculationType.ThirdCorrectionSettlement,
  ];

  formGroup = new FormGroup<FormValues>({
    isInternal: new FormControl<boolean | null>(null, { validators: Validators.required }),
    calculationType: new FormControl<StartCalculationType>(StartCalculationType.BalanceFixing, {
      nonNullable: true,
      validators: Validators.required,
    }),
    gridAreas: new FormControl(
      { value: null, disabled: true },
      { validators: Validators.required }
    ),
    dateRange: new FormControl(null, {
      validators: [WattRangeValidators.required, this.validateResolutionTransition()],
      asyncValidators: () => this.validateBalanceFixing(),
    }),
    isScheduled: new FormControl(false, { nonNullable: true }),
    scheduledAt: new FormControl<Date | null>(null, { validators: this.validateScheduledAt }),
  });

  calculationTypesOptions = dhEnumToWattDropdownOptions(CalculationType);

  selectedExecutionType = 'ACTUAL';
  latestPeriodEnd?: Date | null;
  showPeriodWarning = false;

  minScheduledAt = new Date();
  scheduledAt = toSignal(this.formGroup.controls.scheduledAt.valueChanges);

  minDate = this.ffs.isEnabled('create-calculation-minimum-date')
    ? getMinDate()
    : new Date('2021-02-01'); // Temporary minimum date for certain environments

  maxDate = computed(() =>
    dayjs(this.scheduledAt() ?? new Date())
      .subtract(1, 'day')
      .toDate()
  );

  constructor() {
    this.formGroup.controls.isScheduled.valueChanges.subscribe(() => {
      this.formGroup.controls.scheduledAt.updateValueAndValidity();
    });

    this.formGroup.controls.isInternal.valueChanges.subscribe((isInternal) => {
      if (isInternal) {
        this.formGroup.controls.calculationType.disable();
        this.formGroup.controls.calculationType.setValue(StartCalculationType.Aggregation);
      } else {
        this.formGroup.controls.calculationType.enable();
      }
    });
  }

  ngOnInit(): void {
    // Close toast on navigation
    this._router.events.pipe(first((event) => event instanceof NavigationEnd)).subscribe(() => {
      this._toast.dismiss();
    });
  }

  open() {
    this.modal?.open();
  }

  createCalculation() {
    const { isInternal, calculationType, dateRange, gridAreas, isScheduled, scheduledAt } =
      this.formGroup.getRawValue();

    if (
      this.formGroup.invalid ||
      isInternal === null ||
      calculationType === null ||
      dateRange === null ||
      gridAreas === null
    )
      return;

    this._apollo
      .mutate({
        mutation: CreateCalculationDocument,
        variables: {
          input: {
            isInternal,
            calculationType,
            period: { start: dayjs(dateRange.start).toDate(), end: dayjs(dateRange.end).toDate() },
            gridAreaCodes: gridAreas,
            scheduledAt: isScheduled ? scheduledAt : null,
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
          this.loading = false;
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
        tap((result) => (this.latestPeriodEnd = result.data?.latestBalanceFixing?.period?.end)),
        map(() => null)
      );
  }

  private validateResolutionTransition(): ValidatorFn {
    return (control: AbstractControl<Range<string> | null>): ValidationErrors | null => {
      // List of calculation types that are affected by the validator
      const affected = [StartCalculationType.BalanceFixing, StartCalculationType.Aggregation];
      const calculationType = control.parent?.get('calculationType')?.value;
      if (!affected.includes(calculationType) || !control.value) return null;
      const start = dayjs.utc(control.value.start);
      const end = dayjs.utc(control.value.end);
      const transitionDate = dayjs.utc(this.resolutionTransitionDate);
      return start.isBefore(transitionDate) && end.isAfter(transitionDate)
        ? { resolutionTransition: true }
        : null;
    };
  }

  private validateScheduledAt(control: AbstractControl<Date | null>): ValidationErrors | null {
    if (!control.parent?.get('isScheduled')?.value) return null;
    if (control.value && control.value < new Date()) return { past: true };
    return control.value ? null : { required: true };
  }
}
