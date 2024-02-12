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
import { Component, DestroyRef, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { Apollo, MutationResult } from 'apollo-angular';
import { subYears } from 'date-fns';
import { catchError, of } from 'rxjs';

import {
  MeteringPointType,
  EdiB2CProcessType,
  RequestCalculationDocument,
  EicFunction,
  GetSelectedActorDocument,
  GetActorsForRequestCalculationDocument,
  RequestCalculationMutation,
  GetGridAreasDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { VaterStackComponent, VaterFlexComponent } from '@energinet-datahub/watt/vater';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattRange } from '@energinet-datahub/watt/utils/date';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattToastService } from '@energinet-datahub/watt/toast';
import {
  maxOneMonthDateRangeValidator,
  startAndEndDateCannotBeInTheFutureValidator,
  startDateCannotBeAfterEndDateValidator,
  startDateCannotBeOlderThan3YearsValidator,
} from './dh-whole-request-calculation-validators';

const label = (key: string) => `wholesale.requestCalculation.${key}`;

const ExtendMeteringPoint = { ...MeteringPointType, All: 'All' } as const;
type ExtendMeteringPointType = (typeof ExtendMeteringPoint)[keyof typeof ExtendMeteringPoint];

type SelectedEicFunctionType = EicFunction | null | undefined;

type FormType = {
  processType: FormControl<EdiB2CProcessType | null>;
  period: FormControl<WattRange<string | null>>;
  gridarea: FormControl<string | null>;
  meteringPointType: FormControl<ExtendMeteringPointType | null>;
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
    NgIf,
  ],
})
export class DhWholesaleRequestCalculationComponent {
  private _apollo = inject(Apollo);
  private _fb = inject(NonNullableFormBuilder);
  private _transloco = inject(TranslocoService);
  private _toastService = inject(WattToastService);
  private _destroyRef = inject(DestroyRef);
  private _selectedEicFunction: SelectedEicFunctionType;

  maxDate = new Date();
  minDate = subYears(new Date(), 3);

  isLoading = false;

  form = this._fb.group<FormType>({
    processType: this._fb.control(null, Validators.required),
    period: this._fb.control({ start: null, end: null }, [
      Validators.required,
      WattRangeValidators.required(),
      maxOneMonthDateRangeValidator(),
      startAndEndDateCannotBeInTheFutureValidator(),
      startDateCannotBeAfterEndDateValidator(),
      startDateCannotBeOlderThan3YearsValidator(),
    ]),
    energySupplierId: this._fb.control(null),
    balanceResponsibleId: this._fb.control(null),
    gridarea: this._fb.control(null, Validators.required),
    meteringPointType: this._fb.control(null, Validators.required),
  });

  gridAreaOptions: WattDropdownOptions = [];
  energySupplierOptions: WattDropdownOptions = [];

  meteringPointOptions: WattDropdownOptions = [];
  progressTypeOptions: WattDropdownOptions = [];

  selectedActorQuery = this._apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: GetSelectedActorDocument,
  });

  energySupplierQuery = this._apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: GetActorsForRequestCalculationDocument,
    variables: {
      eicFunctions: [EicFunction.EnergySupplier, EicFunction.BalanceResponsibleParty],
    },
  });

  gridAreaQuery = this._apollo.query({
    query: GetGridAreasDocument,
  });

  constructor() {
    this.gridAreaQuery.subscribe({
      next: ({ data: { gridAreas } }) => {
        this.gridAreaOptions = gridAreas.map((gridArea) => ({
          displayValue: `${gridArea.name} - ${gridArea.name}`,
          value: gridArea.code,
        }));
      },
    });
    this.selectedActorQuery.valueChanges.pipe(takeUntilDestroyed()).subscribe({
      next: (result) => {
        if (result.loading || result.error) return;

        const { glnOrEicNumber, marketRole } = result.data.selectedActor;

        if (!glnOrEicNumber || !marketRole) return;

        this._selectedEicFunction = marketRole;

        if (this._selectedEicFunction === EicFunction.BalanceResponsibleParty) {
          this.form.controls.balanceResponsibleId.setValue(glnOrEicNumber);
        }

        if (this._selectedEicFunction === EicFunction.EnergySupplier) {
          this.form.controls.energySupplierId.setValue(glnOrEicNumber);
        }

        this.form.controls.meteringPointType.setValue(ExtendMeteringPoint.All);

        const excludedMeteringpointTypes = this.getExcludedMeterpointTypes(
          this._selectedEicFunction
        );

        const excludeProcessTypes = this.getExcludedProcessTypes(this._selectedEicFunction);

        this.meteringPointOptions = dhEnumToWattDropdownOptions(
          ExtendMeteringPoint,
          excludedMeteringpointTypes,
          'asc'
        );

        this.progressTypeOptions = dhEnumToWattDropdownOptions(
          EdiB2CProcessType,
          excludeProcessTypes,
          'asc'
        );
      },
    });

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

    if (!queryResult.errors && queryResult?.data?.createAggregatedMeasureDataRequest) {
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

  showEnergySupplierDropdown(): boolean {
    return false; //Not support yet this._selectedEicFunction === EicFunction.BalanceResponsibleParty;
  }

  showBalanceResponsibleDropdown(): boolean {
    return this._selectedEicFunction === EicFunction.EnergySupplier;
  }

  requestCalculation(): void {
    const {
      gridarea,
      meteringPointType,
      period,
      energySupplierId,
      balanceResponsibleId,
      processType: processtType,
    } = this.form.getRawValue();

    if (!gridarea || !meteringPointType || !processtType || !period.start || !period.end) return;

    const meteringPoint = meteringPointType as MeteringPointType;

    this._apollo
      .mutate({
        useMutationLoading: true,
        mutation: RequestCalculationDocument,
        variables: {
          meteringPointType: meteringPointType === ExtendMeteringPoint.All ? null : meteringPoint,
          processtType,
          startDate: period.start,
          endDate: period.end,
          balanceResponsibleId,
          energySupplierId,
          gridArea: gridarea,
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

  private getExcludedMeterpointTypes(selectedEicFunction: SelectedEicFunctionType) {
    return selectedEicFunction === EicFunction.BalanceResponsibleParty ||
      selectedEicFunction === EicFunction.EnergySupplier
      ? [MeteringPointType.Exchange, MeteringPointType.TotalConsumption]
      : [];
  }

  private getExcludedProcessTypes(selectedEicFunction: SelectedEicFunctionType) {
    return selectedEicFunction === EicFunction.BalanceResponsibleParty ||
      selectedEicFunction === EicFunction.EnergySupplier
      ? [
          EdiB2CProcessType.Firstcorrection,
          EdiB2CProcessType.Secondcorrection,
          EdiB2CProcessType.Thirdcorrection,
          EdiB2CProcessType.Wholesalefixing,
        ]
      : [];
  }
}
