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
import { RxPush } from '@rx-angular/template/push';
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

import {
  getActorOptionsSignal,
  getGridAreaOptionsForPeriod,
} from '@energinet-datahub/dh/shared/data-access-graphql';
import {
  EicFunction,
  AggregatedResolution,
  GetMeasurementsReportsDocument,
  MeasurementsReportMarketRole,
  MeasurementsReportMeteringPointType,
  RequestMeasurementsReportDocument,
  RequestMeasurementsReportMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';

import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { selectEntireMonthsValidator } from '../util/select-entire-months.validator';

const ALL_ENERGY_SUPPLIERS = 'ALL_ENERGY_SUPPLIERS';
const maxDaysValidator = WattRangeValidators.maxDays(31);
const maxMonthsValidator = WattRangeValidators.maxMonths(12);
const entireMonthsValidator = selectEntireMonthsValidator;

type DhFormType = FormGroup<{
  period: FormControl<WattRange<Date> | null>;
  gridAreas: FormControl<string[] | null>;
  meteringPointTypes: FormControl<MeasurementsReportMeteringPointType[] | null>;
  energySupplier?: FormControl<string | null>;
  resolution: FormControl<AggregatedResolution>;
  allowLargeTextFiles: FormControl<boolean>;
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
    RxPush,

    WATT_MODAL,
    VaterFlexComponent,
    WattDropdownComponent,
    WattDatepickerComponent,
    WattButtonComponent,
    WattFieldErrorComponent,
    WattFieldHintComponent,
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

  private energySupplierOptionsSignal = getActorOptionsSignal([EicFunction.EnergySupplier]);

  private modal = viewChild.required(WattModalComponent);

  form: DhFormType = this.formBuilder.group({
    meteringPointTypes: new FormControl<MeasurementsReportMeteringPointType[] | null>(null),
    period: new FormControl<WattRange<Date> | null>(null, [Validators.required, maxDaysValidator]),
    gridAreas: new FormControl<string[] | null>(null, Validators.required),
    resolution: new FormControl<AggregatedResolution>(AggregatedResolution.ActualResolution, {
      nonNullable: true,
    }),
    allowLargeTextFiles: new FormControl<boolean>(false, { nonNullable: true }),
  });

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

  meteringPointTypesOptions = dhEnumToWattDropdownOptions(MeasurementsReportMeteringPointType);
  resolutionOptions: WattDropdownOptions = dhEnumToWattDropdownOptions(AggregatedResolution);

  gridAreaOptions$ = this.getGridAreaOptions();

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
    } = this.form.getRawValue();

    if (period == null || gridAreas == null) {
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
          energySupplier: energySupplier === ALL_ENERGY_SUPPLIERS ? null : energySupplier,
          resolution,
          requestAsActorId: this.modalData.actorId,
          requestAsMarketRole: this.mapMarketRole(this.modalData.marketRole),
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
        if (gridAreaOptions.length === 1) {
          this.form.controls.gridAreas.setValue([gridAreaOptions[0].value]);
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

  private mapMarketRole(marketRole: EicFunction): MeasurementsReportMarketRole | null {
    switch (marketRole) {
      case EicFunction.DataHubAdministrator:
        return MeasurementsReportMarketRole.DataHubAdministrator;
      case EicFunction.GridAccessProvider:
        return MeasurementsReportMarketRole.GridAccessProvider;
      case EicFunction.EnergySupplier:
        return MeasurementsReportMarketRole.EnergySupplier;
      default:
        return null;
    }
  }
}
