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
  DestroyRef,
  EnvironmentInjector,
  inject,
  runInInjectionContext,
  signal,
  viewChild,
} from '@angular/core';
import { TranslocoDirective, translate } from '@jsverse/transloco';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RxPush } from '@rx-angular/template/push';
import { Observable, combineLatest, debounceTime, map, of, switchMap, tap } from 'rxjs';
import { Apollo, MutationResult } from 'apollo-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import {
  WATT_MODAL,
  WattModalComponent,
  WattModalService,
  WattTypedModal,
} from '@energinet-datahub/watt/modal';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import {
  WattDatepickerComponent,
  danishTimeZoneIdentifier,
} from '@energinet-datahub/watt/datepicker';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattRange, dayjs } from '@energinet-datahub/watt/date';
import {
  getActorOptions,
  getGridAreaOptionsForPeriod,
} from '@energinet-datahub/dh/shared/data-access-graphql';
import {
  WholesaleAndEnergyCalculationType,
  EicFunction,
  GetSettlementReportCalculationsByGridAreasDocument,
  GetSettlementReportsDocument,
  RequestSettlementReportDocument,
  RequestSettlementReportMutation,
  SettlementReportMarketRole,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { WattFieldErrorComponent, WattFieldHintComponent } from '@energinet-datahub/watt/field';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { DhSelectCalculationModal } from './select-calculation-modal.component';
import { startDateIsNotBeforeDateValidator } from '../util/start-date-is-not-before-date.validator';
import { startDateAndEndDateHaveSameMonthValidator } from '../util/start-date-and-end-date-have-same-month.validator';
import { isPeriodOneFullMonth } from '../util/is-period-one-full-month';

const ALL_ENERGY_SUPPLIERS = 'ALL_ENERGY_SUPPLIERS';

type DhFormType = FormGroup<{
  calculationType: FormControl<string>;
  includeBasisData: FormControl<boolean>;
  allowLargeTextFiles: FormControl<boolean>;
  period: FormControl<WattRange<Date> | null>;
  includeMonthlySum: FormControl<boolean>;
  energySupplier?: FormControl<string | null>;
  gridAreas: FormControl<string[] | null>;
  combineResultsInOneFile: FormControl<boolean>;
  calculationIdForGridAreaGroup?: FormGroup<{
    [gridAreaCode: string]: FormControl<string>;
  }>;
}>;

type SettlementReportRequestedBy = {
  isFas: boolean;
  actorId: string;
  marketRole: EicFunction;
};

@Component({
  selector: 'dh-request-report-modal',
  imports: [
    RxPush,
    ReactiveFormsModule,
    TranslocoDirective,

    WATT_MODAL,
    VaterStackComponent,
    WattDropdownComponent,
    WattCheckboxComponent,
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

    #request-settlement-report-form {
      margin-top: var(--watt-space-ml);
    }

    .items-group > * {
      width: 85%;
    }
  `,
  templateUrl: './request-report-modal.component.html',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhRequestReportModal extends WattTypedModal<SettlementReportRequestedBy> {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly apollo = inject(Apollo);

  private readonly toastService = inject(WattToastService);
  private readonly modalService = inject(WattModalService);

  private modal = viewChild.required(WattModalComponent);

  minDate = dayjs()
    .tz(danishTimeZoneIdentifier)
    .startOf('month')
    .subtract(6, 'months')
    .subtract(3, 'year')
    .toDate();
  maxDate = dayjs().tz(danishTimeZoneIdentifier).toDate();

  form: DhFormType = this.formBuilder.group({
    period: new FormControl<WattRange<Date> | null>(null, [
      Validators.required,
      startDateIsNotBeforeDateValidator(this.minDate),
      startDateAndEndDateHaveSameMonthValidator(),
    ]),
    includeMonthlySum: new FormControl<boolean>(false, { nonNullable: true }),
    gridAreas: new FormControl<string[] | null>(null, Validators.required),
    combineResultsInOneFile: new FormControl<boolean>(false, { nonNullable: true }),
    calculationType: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    includeBasisData: new FormControl<boolean>(false, { nonNullable: true }),
    allowLargeTextFiles: new FormControl<boolean>(false, { nonNullable: true }),
  });

  showEnergySupplierDropdown$ = of(this.modalData.isFas).pipe(
    map((isFas) => isFas || this.modalData.marketRole === EicFunction.SystemOperator),
    tap((showEnergySupplierDropdown) => {
      if (showEnergySupplierDropdown) {
        this.form.addControl(
          'energySupplier',
          new FormControl<string | null>(ALL_ENERGY_SUPPLIERS, Validators.required)
        );
      }
    })
  );

  calculationTypeOptions = this.getCalculationTypeOptions();
  gridAreaOptions$ = this.getGridAreaOptions();
  energySupplierOptions$ = getActorOptions([EicFunction.EnergySupplier]).pipe(
    map((options) => [
      {
        displayValue: translate('shared.all'),
        value: ALL_ENERGY_SUPPLIERS,
      },
      ...options,
    ])
  );

  showMonthlySumCheckbox$ = this.shouldShowMonthlySumCheckbox();

  multipleGridAreasSelected$: Observable<boolean> = this.form.controls.gridAreas.valueChanges.pipe(
    map((gridAreas) => (gridAreas?.length ? gridAreas.length > 1 : false)),
    tap((moreThanOneGridAreas) => {
      if (!moreThanOneGridAreas) {
        this.form.controls.combineResultsInOneFile.setValue(false);
      }
    })
  );

  submitInProgress = signal(false);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  submit(): void {
    if (this.form.invalid || this.submitInProgress()) {
      return;
    }

    this.submitInProgress.set(true);

    this.getCalculationByGridAreas()
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ settlementReportGridAreaCalculationsForPeriod }) => {
          // If there are no calculations for all of the selected grid areas
          if (settlementReportGridAreaCalculationsForPeriod.length === 0) {
            return this.requestSettlementReport();
          }

          this.form.controls.calculationIdForGridAreaGroup = this.formBuilder.group({});

          for (const {
            key,
            value: [firstElement],
          } of settlementReportGridAreaCalculationsForPeriod) {
            this.form.controls.calculationIdForGridAreaGroup?.addControl(
              key,
              new FormControl(firstElement.calculationId, { nonNullable: true })
            );
          }

          // If there is only one calculation per selected grid area
          const onlyOneCalculationPerSelectedGridArea =
            settlementReportGridAreaCalculationsForPeriod.every(
              (gridArea) => gridArea.value.length === 1
            );

          if (onlyOneCalculationPerSelectedGridArea) {
            return this.requestSettlementReport();
          }

          if (
            this.form.getRawValue().calculationType ===
            WholesaleAndEnergyCalculationType.BalanceFixing
          ) {
            return this.requestSettlementReport();
          }

          // If there are multiple calculations for any selected grid area
          this.modalService.open({
            component: DhSelectCalculationModal,
            data: {
              rawData: settlementReportGridAreaCalculationsForPeriod,
              formGroup: this.form.controls.calculationIdForGridAreaGroup,
            },
            onClosed: (isSuccess) => {
              if (isSuccess) {
                this.requestSettlementReport();
              } else {
                this.submitInProgress.set(false);
              }
            },
          });
        },
        error: () => {
          this.showErrorNotification();
        },
      });
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private requestSettlementReport() {
    const {
      calculationType,
      includeBasisData,
      period,
      includeMonthlySum,
      gridAreas,
      energySupplier,
      combineResultsInOneFile,
      allowLargeTextFiles,
    } = this.form.getRawValue();

    if (period == null || gridAreas == null) {
      return;
    }

    let marketRole: SettlementReportMarketRole;

    switch (this.modalData.marketRole) {
      case EicFunction.DataHubAdministrator:
        marketRole = SettlementReportMarketRole.DataHubAdministrator;
        break;
      case EicFunction.EnergySupplier:
        marketRole = SettlementReportMarketRole.EnergySupplier;
        break;
      case EicFunction.GridAccessProvider:
        marketRole = SettlementReportMarketRole.GridAccessProvider;
        break;
      case EicFunction.SystemOperator:
        marketRole = SettlementReportMarketRole.SystemOperator;
        break;
      default:
        marketRole = SettlementReportMarketRole.Other;
        break;
    }

    this.apollo
      .mutate({
        mutation: RequestSettlementReportDocument,
        variables: {
          input: {
            calculationType: calculationType as WholesaleAndEnergyCalculationType,
            includeBasisData,
            period: {
              start: period.start,
              end: period.end ? period.end : null,
            },
            includeMonthlySums: includeMonthlySum,
            gridAreasWithCalculations: this.getGridAreasWithCalculations(
              gridAreas,
              calculationType === WholesaleAndEnergyCalculationType.BalanceFixing
            ),
            combineResultInASingleFile: combineResultsInOneFile,
            preventLargeTextFiles: !allowLargeTextFiles,
            energySupplier: energySupplier == ALL_ENERGY_SUPPLIERS ? null : energySupplier,
            csvLanguage: translate('selectedLanguageIso'),
            requestAsActorId: this.modalData.actorId,
            requestAsMarketRole: marketRole,
          },
        },
        refetchQueries: (result) => {
          if (this.isUpdateSuccessful(result.data)) {
            return [GetSettlementReportsDocument];
          }

          return [];
        },
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ loading, data }) => {
          if (loading) {
            return;
          }

          if (this.isUpdateSuccessful(data)) {
            this.modal().close(true);

            this.showSuccessNotification();
          } else {
            this.showErrorNotification();
          }
        },
        error: () => {
          this.submitInProgress.set(false);

          this.showErrorNotification();
        },
      });
  }

  private getCalculationTypeOptions(): WattDropdownOptions {
    return dhEnumToWattDropdownOptions(WholesaleAndEnergyCalculationType, [
      WholesaleAndEnergyCalculationType.Aggregation,
      this.modalData.marketRole === EicFunction.SystemOperator
        ? WholesaleAndEnergyCalculationType.BalanceFixing
        : '',
    ]);
  }

  private getGridAreasWithCalculations(
    gridAreas: string[],
    isBalanceFixing: boolean
  ): { gridAreaCode: string; calculationId: string | null }[] {
    return gridAreas
      .map((gridAreaCode) => ({
        gridAreaCode,
        calculationId: this.form.controls.calculationIdForGridAreaGroup?.value[gridAreaCode] ?? '',
      }))
      .filter(({ calculationId }) => !!calculationId)
      .map(({ gridAreaCode, calculationId }) => ({
        gridAreaCode,
        calculationId: isBalanceFixing ? null : calculationId,
      }));
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

  private getCalculationByGridAreas() {
    const { calculationType, period, gridAreas } = this.form.getRawValue();

    if (period == null || gridAreas == null) {
      return;
    }

    return this.apollo
      .query({
        query: GetSettlementReportCalculationsByGridAreasDocument,
        variables: {
          calculationType: calculationType as WholesaleAndEnergyCalculationType,
          gridAreaIds: gridAreas,
          calculationPeriod: {
            start: period.start,
            end: period?.end ? period.end : null,
          },
        },
      })
      .pipe(
        map((result) => {
          const dataCopy = structuredClone(result.data);

          return {
            ...dataCopy,
            settlementReportGridAreaCalculationsForPeriod:
              dataCopy.settlementReportGridAreaCalculationsForPeriod.map((entry) => ({
                ...entry,
                value: [...entry.value].sort(
                  (a, b) => b.calculationDate.getTime() - a.calculationDate.getTime()
                ),
              })),
          };
        })
      );
  }

  private shouldShowMonthlySumCheckbox(): Observable<boolean> {
    return combineLatest([
      this.form.controls.calculationType.valueChanges,
      this.form.controls.period.valueChanges,
    ]).pipe(
      map(([calculationType, period]) => {
        if (calculationType == null || period == null) {
          return false;
        }

        const isSpecificCalculationType = [
          WholesaleAndEnergyCalculationType.WholesaleFixing,
          WholesaleAndEnergyCalculationType.FirstCorrectionSettlement,
          WholesaleAndEnergyCalculationType.SecondCorrectionSettlement,
          WholesaleAndEnergyCalculationType.ThirdCorrectionSettlement,
        ].includes(calculationType as WholesaleAndEnergyCalculationType);

        return isSpecificCalculationType && isPeriodOneFullMonth(period);
      }),
      tap((shouldShow) => {
        if (!shouldShow) {
          this.form.controls.includeMonthlySum.setValue(false);
        }
      })
    );
  }

  private isUpdateSuccessful(
    mutationResult: MutationResult<RequestSettlementReportMutation>['data']
  ): boolean {
    return !!mutationResult?.requestSettlementReport.boolean;
  }

  private showSuccessNotification(): void {
    this.toastService.open({
      message: translate('reports.settlementReports.requestReportModal.requestSuccess'),
      type: 'success',
    });
  }

  private showErrorNotification(): void {
    this.toastService.open({
      message: translate('reports.settlementReports.requestReportModal.requestError'),
      type: 'danger',
    });
  }
}
