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
import {
  Component,
  DestroyRef,
  EnvironmentInjector,
  inject,
  runInInjectionContext,
  signal,
  viewChild,
} from '@angular/core';
import { TranslocoDirective, translate } from '@ngneat/transloco';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RxPush } from '@rx-angular/template/push';
import { Observable, combineLatest, map, switchMap, tap } from 'rxjs';
import { Apollo, MutationResult } from 'apollo-angular';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import {
  WATT_MODAL,
  WattModalComponent,
  WattModalService,
  WattTypedModal,
} from '@energinet-datahub/watt/modal';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattRange, dayjs } from '@energinet-datahub/watt/date';
import {
  getActorOptions,
  getGridAreaOptions,
} from '@energinet-datahub/dh/shared/data-access-graphql';
import {
  CalculationType,
  EicFunction,
  GetActorByIdDocument,
  GetSettlementReportCalculationsByGridAreasDocument,
  GetSettlementReportsDocument,
  RequestSettlementReportDocument,
  RequestSettlementReportMutation,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { WattFieldErrorComponent, WattFieldHintComponent } from '@energinet-datahub/watt/field';
import {
  DhSelectedActorStore,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { DhSelectCalculationModalComponent } from './dh-select-calculation-modal.component';
import { dhStartDateIsNotBeforeDateValidator } from '../util/dh-start-date-is-not-before-date.validator';
import { dhIsPeriodOneFullMonth } from '../util/dh-is-period-one-full-month';

type DhFormType = FormGroup<{
  calculationType: FormControl<string>;
  includeBasisData: FormControl<boolean>;
  period: FormControl<WattRange<string> | null>;
  includeMonthlySum: FormControl<boolean>;
  energySupplier?: FormControl<string | null>;
  gridAreas: FormControl<string[] | null>;
  combineResultsInOneFile: FormControl<boolean>;
  calculationIdForGridAreaGroup?: FormGroup<{
    [gridAreaCode: string]: FormControl<string>;
  }>;
}>;

@Component({
  selector: 'dh-request-settlement-report-modal',
  standalone: true,
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
  templateUrl: './dh-request-settlement-report-modal.component.html',
})
export class DhRequestSettlementReportModalComponent extends WattTypedModal {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly destroyRef = inject(DestroyRef);

  private readonly permissionService = inject(PermissionService);
  private readonly apollo = inject(Apollo);
  private readonly toastService = inject(WattToastService);
  private readonly actorStore = inject(DhSelectedActorStore);
  private readonly modalService = inject(WattModalService);

  private modal = viewChild.required(WattModalComponent);

  minDate = dayjs().startOf('month').subtract(6, 'months').subtract(3, 'year').toDate();
  maxDate = new Date();

  form: DhFormType = this.formBuilder.group({
    calculationType: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    includeBasisData: new FormControl<boolean>(false, { nonNullable: true }),
    period: new FormControl<WattRange<string> | null>(null, [
      Validators.required,
      dhStartDateIsNotBeforeDateValidator(this.minDate),
    ]),
    includeMonthlySum: new FormControl<boolean>(false, { nonNullable: true }),
    gridAreas: new FormControl<string[] | null>(null, Validators.required),
    combineResultsInOneFile: new FormControl<boolean>(false, { nonNullable: true }),
  });

  isFas$ = this.permissionService.isFas().pipe(
    tap((isFas) => {
      if (isFas) {
        this.form.addControl(
          'energySupplier',
          new FormControl<string | null>(null, Validators.required)
        );
      }
    })
  );

  calculationTypeOptions = dhEnumToWattDropdownOptions(CalculationType, null, [
    CalculationType.Aggregation,
    CalculationType.WholesaleFixing,
    CalculationType.FirstCorrectionSettlement,
    CalculationType.SecondCorrectionSettlement,
    CalculationType.ThirdCorrectionSettlement,
  ]);
  gridAreaOptions$ = this.getGridAreaOptions();
  energySupplierOptions$ = getActorOptions([EicFunction.EnergySupplier]);

  hasMoreThanOneGridAreaOption = toSignal(this.hasMoreThanOneGridAreaOption$());

  showMonthlySumCheckbox$ = this.shouldShowMonthlySumCheckbox();

  miltipleGridAreasSelected$: Observable<boolean> = this.form.controls.gridAreas.valueChanges.pipe(
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
    if (this.form.invalid) {
      return;
    }

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

          // If there are multiple calculations for any selected grid area
          this.modalService.open({
            component: DhSelectCalculationModalComponent,
            data: {
              rawData: settlementReportGridAreaCalculationsForPeriod,
              formGroup: this.form.controls.calculationIdForGridAreaGroup,
            },
            onClosed: (isSuccess) => {
              if (isSuccess) {
                this.requestSettlementReport();
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
    } = this.form.getRawValue();

    if (period == null || gridAreas == null) {
      return;
    }

    this.apollo
      .mutate({
        mutation: RequestSettlementReportDocument,
        variables: {
          input: {
            calculationType: calculationType as CalculationType,
            includeBasisData: includeBasisData,
            period: {
              start: new Date(period.start),
              end: period.end ? new Date(period.end) : null,
            },
            includeMonthlySums: includeMonthlySum,
            gridAreasWithCalculations: gridAreas.map((gridAreaCode) => ({
              gridAreaCode,
              calculationId:
                this.form.controls.calculationIdForGridAreaGroup?.value[gridAreaCode] ?? '',
            })),
            combineResultInASingleFile: combineResultsInOneFile,
            supplierId: energySupplier,
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
          this.submitInProgress.set(loading);

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

  private getGridAreaOptions(): Observable<WattDropdownOptions> {
    return this.isFas$.pipe(
      switchMap((isFas) => {
        if (isFas) {
          return runInInjectionContext(this.environmentInjector, () => getGridAreaOptions());
        }

        return this.getGridAreaOptionsForActor();
      })
    );
  }

  private getGridAreaOptionsForActor(): Observable<WattDropdownOptions> {
    return this.actorStore.selectedActor$.pipe(
      switchMap((actor) =>
        this.apollo.query({
          query: GetActorByIdDocument,
          variables: {
            id: actor?.id,
          },
        })
      ),
      map((result) =>
        result.data.actorById.gridAreas.map((gridArea) => ({
          value: gridArea.code,
          displayValue: gridArea.displayName,
        }))
      ),
      tap((gridAreaOptions) => {
        if (gridAreaOptions.length === 1) {
          this.form.controls.gridAreas.setValue([gridAreaOptions[0].value]);
        }
      })
    );
  }

  private hasMoreThanOneGridAreaOption$(): Observable<boolean> {
    return this.gridAreaOptions$.pipe(map((gridAreaOptions) => gridAreaOptions.length > 1));
  }

  private getCalculationByGridAreas() {
    const { period, gridAreas } = this.form.getRawValue();

    if (period == null || gridAreas == null) {
      return;
    }

    return this.apollo
      .query({
        query: GetSettlementReportCalculationsByGridAreasDocument,
        variables: {
          gridAreaIds: gridAreas,
          calculationPeriod: {
            start: new Date(period.start),
            end: period?.end ? new Date(period.end) : null,
          },
        },
      })
      .pipe(map((result) => result.data));
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
          CalculationType.WholesaleFixing,
          CalculationType.FirstCorrectionSettlement,
          CalculationType.SecondCorrectionSettlement,
          CalculationType.ThirdCorrectionSettlement,
        ].includes(calculationType as CalculationType);

        return isSpecificCalculationType && dhIsPeriodOneFullMonth(period);
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
      message: translate('wholesale.settlementReportsV2.requestReportModal.requestSuccess'),
      type: 'success',
    });
  }

  private showErrorNotification(): void {
    this.toastService.open({
      message: translate('wholesale.settlementReportsV2.requestReportModal.requestError'),
      type: 'danger',
    });
  }
}
