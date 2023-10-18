import { Component, DestroyRef, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  MeteringPointType,
  EdiB2CProcessType,
  RequestCalculationDocument,
  EicFunction,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { VaterStackComponent, VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import {
  DhDropdownTranslatorDirective,
  enumToDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { Apollo, MutationResult } from 'apollo-angular';
import { graphql } from '@energinet-datahub/dh/shared/domain';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { differenceInDays, parseISO, subDays } from 'date-fns';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattRange } from '@energinet-datahub/watt/date';
import { JsonPipe, NgIf } from '@angular/common';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { catchError, of } from 'rxjs';

const maxOneMonthDateRangeValidator =
  () =>
  (control: AbstractControl): ValidationErrors | null => {
    const range = control.value as WattRange<string>;

    if (!range) return null;

    const rangeInDays = differenceInDays(parseISO(range.end), parseISO(range.start));
    if (rangeInDays > 31) {
      return { maxOneMonthDateRange: true };
    }

    return null;
  };

const label = (key: string) => `wholesale.requestCalculation.${key}`;

type FormType = {
  processType: FormControl<EdiB2CProcessType | null>;
  period: FormControl<WattRange<string | null>>;
  gridarea: FormControl<string | null>;
  meteringPointType: FormControl<MeteringPointType | null>;
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
    JsonPipe,
    NgIf,
  ],
})
export class DhWholesaleRequestCalculationComponent {
  private _apollo = inject(Apollo);
  private _fb = inject(NonNullableFormBuilder);
  private _transloco = inject(TranslocoService);
  private _toastService = inject(WattToastService);
  private _destroyRef = inject(DestroyRef);
  private _selectedGlnOrEicNumber: string | null = null;
  private _selectedEicFunction: EicFunction | null | undefined = null;

  maxDate = subDays(new Date(), 5);

  form = this._fb.group<FormType>({
    processType: this._fb.control(null, Validators.required),
    period: this._fb.control({ start: null, end: null }, [
      Validators.required,
      WattRangeValidators.required(),
      maxOneMonthDateRangeValidator(),
    ]),
    energySupplierId: this._fb.control(null),
    balanceResponsibleId: this._fb.control(null),
    gridarea: this._fb.control(null, Validators.required),
    meteringPointType: this._fb.control(null, Validators.required),
  });

  gridAreaOptions: WattDropdownOptions = [];
  energySupplierOptions: WattDropdownOptions = [];
  balanceResponsibleOptions: WattDropdownOptions = [];

  meteringPointOptions = enumToDropdownOptions(MeteringPointType);
  progressTypeOptions = enumToDropdownOptions(EdiB2CProcessType);

  selectedActorQuery = this._apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: graphql.GetSelectedActorDocument,
  });

  energySupplierQuery = this._apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: graphql.GetActorsForRequestCalculationDocument,
    variables: {
      eicFunctions: [EicFunction.EnergySupplier, EicFunction.BalanceResponsibleParty],
    },
  });

  constructor() {
    this.selectedActorQuery.valueChanges.pipe(takeUntilDestroyed()).subscribe({
      next: (result) => {
        if (result.loading === false) {
          const { glnOrEicNumber, gridAreas, marketRole } = result.data.selectedActor;
          this._selectedEicFunction = marketRole;
          this._selectedGlnOrEicNumber = glnOrEicNumber;
          this.gridAreaOptions = gridAreas.map((gridArea) => ({
            displayValue: `${gridArea.name} - ${gridArea.name}`,
            value: gridArea.code,
          }));
        }
      },
    });

    this.energySupplierQuery.valueChanges.pipe(takeUntilDestroyed()).subscribe({
      next: (result) => {
        if (result.loading === false) {
          const { actorsForEicFunction } = result.data;
          this.energySupplierOptions = actorsForEicFunction
            .filter((actor) => actor.value === EicFunction.EnergySupplier)
            .map((actor) => ({
              displayValue: actor.displayValue,
              value: actor.value,
            }));

          this.balanceResponsibleOptions = actorsForEicFunction
            .filter((actor) => actor.value === EicFunction.BalanceResponsibleParty)
            .map((actor) => ({
              displayValue: actor.displayValue,
              value: actor.value,
            }));
        }
      },
    });
  }

  handleResponse(queryResult: MutationResult<graphql.RequestCalculationMutation> | null): void {
    if (queryResult === null) {
      this.showErrorToast();
      return;
    }

    if (queryResult.loading) return;

    if (
      queryResult.data &&
      queryResult.data.createAggregatedMeasureDataRequest &&
      !queryResult.errors
    ) {
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
    return this._selectedEicFunction === EicFunction.BalanceResponsibleParty;
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
      processType: processtType,
    } = this.form.getRawValue();
    if (
      !gridarea ||
      !meteringPointType ||
      !processtType ||
      !period.start ||
      !period.end ||
      !energySupplierId
    )
      return;

    this._apollo
      .mutate({
        useMutationLoading: true,
        mutation: RequestCalculationDocument,
        variables: {
          meteringPointType,
          processtType,
          startDate: period.start,
          endDate: period.end,
          balanceResponsibleId:
            this._selectedEicFunction === EicFunction.BalanceResponsibleParty
              ? this._selectedGlnOrEicNumber
              : null,
          energySupplierId:
            this._selectedEicFunction === EicFunction.EnergySupplier
              ? this._selectedGlnOrEicNumber
              : energySupplierId,
          gridArea: gridarea,
        },
      })
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        catchError(() => of(null))
      )
      .subscribe((res) => this.handleResponse(res));
  }
}
