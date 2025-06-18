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
import { debounceTime, Observable, switchMap, tap } from 'rxjs';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_MODAL, WattModalComponent, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattRange } from '@energinet-datahub/watt/date';
import { WattFieldErrorComponent, WattFieldHintComponent } from '@energinet-datahub/watt/field';
import { WattToastService } from '@energinet-datahub/watt/toast';

import {
  getActorOptionsSignal,
  getGridAreaOptionsForPeriod,
} from '@energinet-datahub/dh/shared/data-access-graphql';
import {
  EicFunction,
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

import { startDateAndEndDateHaveSameMonthValidator } from '../util/start-date-and-end-date-have-same-month.validator';

const ALL_ENERGY_SUPPLIERS = 'ALL_ENERGY_SUPPLIERS';

type DhFormType = FormGroup<{
  meteringPointTypes: FormControl<MeasurementsReportMeteringPointType[] | null>;
  period: FormControl<WattRange<Date> | null>;
  gridAreas: FormControl<string[] | null>;
  energySupplier?: FormControl<string | null>;
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
    VaterStackComponent,
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

  private modal = viewChild.required(WattModalComponent);

  form: DhFormType = this.formBuilder.group({
    meteringPointTypes: new FormControl<MeasurementsReportMeteringPointType[] | null>(null),
    period: new FormControl<WattRange<Date> | null>(null, [
      Validators.required,
      startDateAndEndDateHaveSameMonthValidator(),
    ]),
    gridAreas: new FormControl<string[] | null>(null, Validators.required),
  });

  private gridAreaChanges = toSignal(this.form.controls.gridAreas.valueChanges);

  meteringPointTypesOptions = dhEnumToWattDropdownOptions(MeasurementsReportMeteringPointType);

  gridAreaOptions$ = this.getGridAreaOptions();

  multipleGridAreasSelected = computed(() => {
    const gridAreas = this.gridAreaChanges();

    if (gridAreas == null) {
      return false;
    }

    return gridAreas.length > 1;
  });

  showEnergySupplierDropdown = this.modalData.isFas;

  private energySupplierOptionsSignal = getActorOptionsSignal([EicFunction.EnergySupplier]);

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

  async submit() {
    if (this.form.invalid || this.submitInProgress()) {
      return;
    }

    const { meteringPointTypes, energySupplier, period, gridAreas } = this.form.getRawValue();

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
          meteringPointTypes,
          energySupplier: energySupplier === ALL_ENERGY_SUPPLIERS ? null : energySupplier,
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
