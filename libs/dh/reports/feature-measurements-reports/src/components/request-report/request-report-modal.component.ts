//#region License
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
//#endregion
import {
  Component,
  computed,
  DestroyRef,
  effect,
  EnvironmentInjector,
  inject,
  runInInjectionContext,
  untracked,
  viewChild,
} from '@angular/core';
import { translate, TranslocoDirective } from '@jsverse/transloco';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MutationResult } from 'apollo-angular';
import { debounceTime, distinctUntilChanged, Observable, switchMap, tap } from 'rxjs';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WattRange } from '@energinet-datahub/watt/date';
import { WattFieldErrorComponent, WattFieldHintComponent } from '@energinet-datahub/watt/field';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { WattTextAreaFieldComponent } from '@energinet-datahub/watt/textarea-field';

import {
  getActorOptions,
  getGridAreaOptionsForPeriod,
} from '@energinet-datahub/dh/shared/data-access-graphql';
import {
  EicFunction,
  AggregatedResolution,
  GetMeasurementsReportsDocument,
  MeasurementsReportMeteringPointType,
  RequestMeasurementsReportDocument,
  RequestMeasurementsReportMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';

import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhMeteringPointIDsValidator,
  normalizeMeteringPointIDs,
} from '@energinet-datahub/dh/shared/ui-util';

import { selectEntireMonthsValidator } from '../util/select-entire-months.validator';
import { mapMarketRole } from '../util/map-market-role';

const ALL_ENERGY_SUPPLIERS = 'ALL_ENERGY_SUPPLIERS';
const maxDaysValidator = WattRangeValidators.maxDays(31);
const maxMonthsValidator = WattRangeValidators.maxMonths(12);
const entireMonthsValidator = selectEntireMonthsValidator;
const resolutionOptionsToDisable: AggregatedResolution[] = [
  AggregatedResolution.ActualResolution,
  AggregatedResolution.SumOfHour,
];

type DhFormType = FormGroup<{
  period: FormControl<WattRange<Date> | null>;
  gridAreas: FormControl<string[] | null>;
  meteringPointTypes: FormControl<MeasurementsReportMeteringPointType[] | null>;
  energySupplier?: FormControl<string | null>;
  resolution: FormControl<AggregatedResolution | null>;
  allowLargeTextFiles: FormControl<boolean>;
  meteringPointIDs: FormControl<string>;
  switchToMeteringPointIDs: FormControl<boolean>;
}>;

type MeasurementsReportRequestedBy = {
  isFas: boolean;
  actorId: string;
  marketRole: EicFunction;
};

@Component({
  selector: 'dh-request-report-modal',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,

    WATT_MODAL,
    VaterFlexComponent,
    WattDropdownComponent,
    WattDatepickerComponent,
    WattButtonComponent,
    WattFieldErrorComponent,
    WattFieldHintComponent,
    WattCheckboxComponent,
    WattFieldHintComponent,
    WattFieldErrorComponent,
    WattTextAreaFieldComponent,
    DhDropdownTranslatorDirective,
  ],
  styles: `
    :host {
      display: block;
    }

    #request-measurements-report-form {
      margin-top: var(--watt-space-ml);
    }

    .items-group > * {
      width: 85%;
    }

    watt-textarea-field {
      --watt-textarea-min-height: 100px;
    }
  `,
  templateUrl: './request-report-modal.component.html',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhRequestReportModal extends WattTypedModal<MeasurementsReportRequestedBy> {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly destroyRef = inject(DestroyRef);

  private readonly toastService = inject(WattToastService);

  private readonly requestReportMutation = mutation(RequestMeasurementsReportDocument);

  private energySupplierOptionsSignal = getActorOptions([EicFunction.EnergySupplier]);

  private modal = viewChild.required(WattModalComponent);

  maxIDs = 50;
  normalizeMeteringPointIDs = normalizeMeteringPointIDs;

  form: DhFormType = this.formBuilder.group({
    meteringPointTypes: new FormControl<MeasurementsReportMeteringPointType[] | null>(null),
    period: new FormControl<WattRange<Date> | null>(null, [Validators.required, maxDaysValidator]),
    gridAreas: new FormControl<string[] | null>(null, Validators.required),
    resolution: new FormControl<AggregatedResolution | null>(null, Validators.required),
    allowLargeTextFiles: new FormControl<boolean>(false, { nonNullable: true }),
    meteringPointIDs: new FormControl('', {
      validators: [dhMeteringPointIDsValidator(this.maxIDs)],
      nonNullable: true,
    }),
    switchToMeteringPointIDs: new FormControl<boolean>(false, { nonNullable: true }),
  });

  private switchToMeteringPointIDsChanges = toSignal(
    this.form.controls.switchToMeteringPointIDs.valueChanges
  );
  private gridAreaChanges = toSignal(this.form.controls.gridAreas.valueChanges);
  private resolutionChanges = toSignal(this.form.controls.resolution.valueChanges);

  private resolutionEffect = effect(() => {
    if (this.resolutionChanges() === AggregatedResolution.SumOfMonth) {
      this.form.controls.period.removeValidators(maxDaysValidator);
      this.form.controls.period.addValidators([entireMonthsValidator, maxMonthsValidator]);
    } else {
      this.form.controls.period.removeValidators([entireMonthsValidator, maxMonthsValidator]);
      this.form.controls.period.addValidators(maxDaysValidator);
    }

    this.form.controls.period.updateValueAndValidity();
  });

  private switchToMeteringPointIDsEffect = effect(() => {
    const switchToMeteringPointIDs = this.switchToMeteringPointIDsChanges();
    const gridAreas = untracked(() => this.gridAreaOptions().map((option) => option.value));

    if (switchToMeteringPointIDs) {
      this.form.controls.meteringPointTypes.reset();
      this.form.controls.meteringPointTypes.disable();

      this.form.controls.gridAreas.disable();
      this.form.controls.gridAreas.setValue(gridAreas);

      this.form.controls.meteringPointIDs.addValidators(Validators.required);
    } else {
      this.form.controls.meteringPointTypes.enable();

      this.form.controls.gridAreas.enable();
      this.form.controls.gridAreas.markAsPristine();
      this.form.controls.gridAreas.markAsUntouched();

      this.form.controls.meteringPointIDs.reset();
      this.form.controls.meteringPointIDs.removeValidators(Validators.required);

      const resolutionValue = this.resolutionChanges();

      if (resolutionValue && resolutionOptionsToDisable.includes(resolutionValue)) {
        this.form.controls.resolution.reset();
      }
    }

    this.form.controls.meteringPointIDs.updateValueAndValidity();
  });

  meteringPointTypesOptions = dhEnumToWattDropdownOptions(MeasurementsReportMeteringPointType);
  resolutionOptions = computed(() => {
    const switchToMeteringPointIDs = this.switchToMeteringPointIDsChanges();

    return dhEnumToWattDropdownOptions(
      AggregatedResolution,
      undefined,
      switchToMeteringPointIDs ? undefined : resolutionOptionsToDisable
    );
  });

  gridAreaOptions = toSignal(this.getGridAreaOptions(), {
    initialValue: [],
  });

  multipleGridAreasSelected = computed(() => {
    const gridAreas = this.gridAreaChanges();

    if (gridAreas == null) {
      return false;
    }

    return gridAreas.length > 1;
  });

  showEnergySupplierDropdown = this.modalData.isFas;

  energySupplierOptions = computed<WattDropdownOptions>(() => [
    {
      displayValue: translate('shared.all'),
      value: ALL_ENERGY_SUPPLIERS,
    },
    ...this.energySupplierOptionsSignal(),
  ]);

  constructor() {
    super();

    if (this.showEnergySupplierDropdown) {
      this.form.addControl(
        'energySupplier',
        new FormControl<string>(ALL_ENERGY_SUPPLIERS, Validators.required)
      );
    }
  }

  submitInProgress = this.requestReportMutation.loading;

  // eslint-disable-next-line sonarjs/cognitive-complexity
  async submit() {
    if (this.form.invalid || this.submitInProgress()) {
      return;
    }

    const {
      meteringPointTypes,
      resolution,
      energySupplier,
      period,
      gridAreas,
      allowLargeTextFiles,
      meteringPointIDs,
    } = this.form.getRawValue();

    if (period == null || gridAreas == null || resolution == null) {
      return;
    }

    const result = await this.requestReportMutation.mutate({
      variables: {
        input: {
          period: {
            start: period.start,
            end: period.end ? period.end : null,
          },
          gridAreaCodes: gridAreas,
          preventLargeTextFiles: !allowLargeTextFiles,
          meteringPointTypes:
            meteringPointTypes ?? Object.values(MeasurementsReportMeteringPointType),
          meteringPointIDs:
            meteringPointIDs === '' ? null : normalizeMeteringPointIDs(meteringPointIDs),
          energySupplier: energySupplier === ALL_ENERGY_SUPPLIERS ? null : energySupplier,
          resolution,
          requestAsActorId: this.modalData.actorId,
          requestAsMarketRole: mapMarketRole(this.modalData.marketRole),
        },
      },
      refetchQueries: ({ data }) => {
        if (this.isUpdateSuccessful(data)) {
          return [GetMeasurementsReportsDocument];
        }

        return [];
      },
    });

    if (this.isUpdateSuccessful(result.data)) {
      this.modal().close(true);

      this.showSuccessNotification();
    } else {
      this.showErrorNotification();
    }
  }

  private getGridAreaOptions(): Observable<WattDropdownOptions> {
    const arbitraryDebounceTime = 50;

    return this.form.controls.period.valueChanges.pipe(
      // Needed because the watt-datepicker component
      // emits multiple times when the period changes
      debounceTime(arbitraryDebounceTime),
      takeUntilDestroyed(this.destroyRef),
      distinctUntilChanged(),
      tap(() => {
        this.form.controls.gridAreas.setValue(null);
        this.form.controls.gridAreas.markAsPristine();
        this.form.controls.gridAreas.markAsUntouched();
      }),
      switchMap((maybePeriod) => {
        if (maybePeriod == null) {
          return [];
        }

        return runInInjectionContext(this.environmentInjector, () =>
          getGridAreaOptionsForPeriod(maybePeriod, this.modalData.actorId)
        );
      }),
      tap((gridAreaOptions) => {
        if (this.form.controls.switchToMeteringPointIDs.value) {
          this.form.controls.gridAreas.setValue(gridAreaOptions.map((option) => option.value));
        } else {
          if (gridAreaOptions.length === 1) {
            this.form.controls.gridAreas.setValue([gridAreaOptions[0].value]);
          }
        }
      })
    );
  }

  private isUpdateSuccessful(
    mutationResult: MutationResult<RequestMeasurementsReportMutation>['data']
  ): boolean {
    return !!mutationResult?.requestMeasurementsReport.boolean;
  }

  private showSuccessNotification(): void {
    this.toastService.open({
      message: translate('reports.measurementsReports.requestReportModal.requestSuccess'),
      type: 'success',
    });
  }

  private showErrorNotification(): void {
    this.toastService.open({
      message: translate('reports.measurementsReports.requestReportModal.requestError'),
      type: 'danger',
    });
  }
}
