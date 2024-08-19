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
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  Validators,
  FormControl,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';

import { RxPush } from '@rx-angular/template/push';
import { Apollo, MutationResult } from 'apollo-angular';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { catchError, filter, map, of, startWith, switchMap, tap } from 'rxjs';

import {
  MeteringPointType,
  RequestCalculationDocument,
  EicFunction,
  GetSelectedActorDocument,
  GetActorsForRequestCalculationDocument,
  RequestCalculationMutation,
  GetGridAreasDocument,
  CalculationType,
  PriceType,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { dayjs } from '@energinet-datahub/watt/utils/date';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattRangeValidators } from '@energinet-datahub/watt/utils/validators';
import { WattDatepickerComponent } from '@energinet-datahub/watt/picker/datepicker';
import {
  aggregationCalculationTypes,
  getMinDate,
  wholesaleCalculationTypes,
} from '@energinet-datahub/dh/wholesale/domain';
import { VaterStackComponent, VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';

import { Permission, Range } from '@energinet-datahub/dh/shared/domain';
import { getGridAreaOptions } from '@energinet-datahub/dh/shared/data-access-graphql';
import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';

import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { max31DaysDateRangeValidator } from './dh-wholesale-request-calculation-validators';
import { exists } from '@energinet-datahub/dh/shared/util-operators';

const label = (key: string) => `wholesale.requestCalculation.${key}`;

const ExtendMeteringPoint = { ...MeteringPointType, All: 'All' } as const;
type ExtendMeteringPointType = (typeof ExtendMeteringPoint)[keyof typeof ExtendMeteringPoint];

type FormType = {
  calculationType: FormControl<CalculationType | null>;
  period: FormControl<Range<string> | null>;
  gridArea: FormControl<string | null>;
  meteringPointType: FormControl<ExtendMeteringPointType | null>;
  priceType: FormControl<PriceType | null>;
  energySupplierId: FormControl<string | null>;
  balanceResponsibleId: FormControl<string | null>;
};

@Component({
  selector: 'dh-wholesale-request-calculation',
  templateUrl: './dh-wholesale-request-calculation.html',
  standalone: true,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;

        watt-card {
          width: 70%;
        }

        watt-dropdown,
        watt-datepicker {
          width: 50%;
        }
      }
    `,
  ],
  imports: [
    WATT_CARD,
    WattDropdownComponent,
    WattButtonComponent,
    DhDropdownTranslatorDirective,
    VaterStackComponent,
    VaterFlexComponent,
    ReactiveFormsModule,
    FormsModule,
    TranslocoDirective,
    WattDatepickerComponent,
    WattFieldErrorComponent,
    RxPush,
  ],
})
export class DhWholesaleRequestCalculationComponent {
  private _apollo = inject(Apollo);
  private _fb = inject(NonNullableFormBuilder);
  private _transloco = inject(TranslocoService);
  private _toastService = inject(WattToastService);
  private _destroyRef = inject(DestroyRef);
  private _permissionService = inject(PermissionService);

  minDate = getMinDate();
  maxDate = new Date();

  requestAggregatedMeasuredDataView = this.hasPermission('request-aggregated-measured-data:view');
  requestWholesaleSettlementView = this.hasPermission('request-wholesale-settlement:view');

  excludeCalculationTypes = computed(() => {
    const aggregation = this.requestAggregatedMeasuredDataView() ? [] : aggregationCalculationTypes;
    const wholesale = this.requestWholesaleSettlementView() ? [] : wholesaleCalculationTypes;
    return [...aggregation, ...wholesale];
  });

  gridAreaIsRequired = signal(false);

  isLoading = false;
  isReady = false;

  form = this._fb.group<FormType>({
    calculationType: this._fb.control(CalculationType.Aggregation, Validators.required),
    period: this._fb.control(null, [
      Validators.required,
      WattRangeValidators.required,
      max31DaysDateRangeValidator,
    ]),
    gridArea: this._fb.control(null),
    meteringPointType: this._fb.control(ExtendMeteringPoint.All, Validators.required),
    priceType: this._fb.control(PriceType.TariffSubscriptionAndFee, Validators.required),
    energySupplierId: this._fb.control(null),
    balanceResponsibleId: this._fb.control(null),
  });

  gridAreaOptions$ = getGridAreaOptions();
  energySupplierOptions: WattDropdownOptions = [];

  meteringPointOptions: WattDropdownOptions = [];
  priceTypeOptions = computed(() => dhEnumToWattDropdownOptions(PriceType));
  calculationTypeOptions = computed(() =>
    dhEnumToWattDropdownOptions(CalculationType, 'asc', this.excludeCalculationTypes())
  );

  selectedActorQuery = this._apollo.watchQuery({
    query: GetSelectedActorDocument,
  });

  energySupplierQuery = this._apollo.watchQuery({
    query: GetActorsForRequestCalculationDocument,
    variables: {
      eicFunctions: [EicFunction.EnergySupplier, EicFunction.BalanceResponsibleParty],
    },
  });

  gridAreaQuery = this._apollo.query({
    query: GetGridAreasDocument,
  });

  constructor() {
    this.selectedActorQuery.valueChanges
      .pipe(
        filter((result) => !result.loading && !result.error),
        tap(() => {
          this.isReady = true;
        }),
        map((result) => result.data.selectedActor),
        map(({ marketRole, ...rest }) => (marketRole ? { ...rest, marketRole } : null)),
        exists(),
        tap(({ marketRole }) => {
          this.meteringPointOptions = dhEnumToWattDropdownOptions(
            ExtendMeteringPoint,
            'asc',
            this.getExcludedMeterpointTypes(marketRole)
          );
        }),
        tap(({ glnOrEicNumber, marketRole }) => {
          if (marketRole === EicFunction.BalanceResponsibleParty) {
            this.form.controls.balanceResponsibleId.setValue(glnOrEicNumber);
          } else if (marketRole === EicFunction.EnergySupplier) {
            this.form.controls.energySupplierId.setValue(glnOrEicNumber);
          }
        }),
        switchMap(({ marketRole }) =>
          this.form.controls.calculationType.valueChanges.pipe(
            startWith(this.form.controls.calculationType.value),
            exists(),
            map((value) => wholesaleCalculationTypes.includes(value)),
            tap((isWholesale) => {
              if (isWholesale && marketRole !== EicFunction.GridAccessProvider) {
                this.gridAreaIsRequired.set(false);
                this.form.controls.gridArea.removeValidators(Validators.required);
              } else {
                this.gridAreaIsRequired.set(true);
                this.form.controls.gridArea.setValidators(Validators.required);
              }
            }),
            tap(() => this.form.controls.gridArea.updateValueAndValidity())
          )
        ),
        takeUntilDestroyed()
      )
      .subscribe();

    this.energySupplierQuery.valueChanges.pipe(takeUntilDestroyed()).subscribe({
      next: (result) => {
        if (result.loading === false) {
          const { actorsForEicFunction } = result.data;
          this.energySupplierOptions = actorsForEicFunction
            .filter((actor) => actor.marketRole === EicFunction.EnergySupplier)
            .map((actor) => ({
              displayValue: actor.displayValue,
              value: actor.value,
            }));
        }
      },
    });
  }

  handleResponse(queryResult: MutationResult<RequestCalculationMutation> | null): void {
    if (queryResult === null) {
      this.showErrorToast();
      return;
    }

    if (queryResult.loading) return;

    if (!queryResult.errors && queryResult?.data?.requestCalculation) {
      const message = this._transloco.translate(label('success'));
      this._toastService.open({ message, type: 'success' });
    } else {
      this.showErrorToast();
    }
  }

  showErrorToast(): void {
    const message = this._transloco.translate(label('error'));
    this._toastService.open({ message, type: 'danger' });
  }

  isWholesaleRequest() {
    const calculationType = this.form.controls.calculationType.value;
    return !calculationType ? true : wholesaleCalculationTypes.includes(calculationType);
  }

  requestCalculation(): void {
    const {
      calculationType,
      period,
      gridArea,
      meteringPointType,
      priceType,
      energySupplierId,
      balanceResponsibleId,
    } = this.form.getRawValue();

    if (!calculationType || !period) return;

    this._apollo
      .mutate({
        mutation: RequestCalculationDocument,
        variables: {
          calculationType,
          period: { start: dayjs(period.start).toDate(), end: dayjs(period.end).toDate() },
          gridArea,
          meteringPointType:
            meteringPointType === ExtendMeteringPoint.All ? null : meteringPointType,
          priceType,
          balanceResponsibleId,
          energySupplierId,
        },
      })
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        catchError(() => of(null))
      )
      .subscribe((res) => {
        this.isLoading = res?.loading ?? false;

        this.handleResponse(res);
      });
  }

  private getExcludedMeterpointTypes(selectedEicFunction: EicFunction) {
    return selectedEicFunction === EicFunction.BalanceResponsibleParty ||
      selectedEicFunction === EicFunction.EnergySupplier
      ? [MeteringPointType.Exchange, MeteringPointType.TotalConsumption]
      : [];
  }

  hasPermission(permission: Permission) {
    return toSignal(this._permissionService.hasPermission(permission), { initialValue: false });
  }
}
