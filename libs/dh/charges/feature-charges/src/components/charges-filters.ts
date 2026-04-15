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
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, computed, effect, inject, model } from '@angular/core';

import { TranslocoDirective, translateObjectSignal } from '@jsverse/transloco';

import {
  ChargeType,
  EicFunction,
  ChargeResolution,
  ChargeOverviewQueryInput,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { getActorOptions } from '@energinet-datahub/dh/shared/data-access-graphql';
import { DhActorStorage } from '@energinet-datahub/dh/shared/feature-authorization';

import {
  dhMakeFormControl,
  dhEnumToWattDropdownOptions,
  DhDropdownTranslatorDirective,
  DhResetFiltersButtonComponent,
} from '@energinet-datahub/dh/shared/ui-util';

import { VATER } from '@energinet/watt/vater';
import { WattQueryParamsDirective } from '@energinet/watt/query-params';
import { WattDropdownComponent, WattDropdownOptionGroup } from '@energinet/watt/dropdown';
import { WattDateChipComponent, WattFormChipDirective } from '@energinet/watt/chip';

@Component({
  selector: 'dh-charges-filters',
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    VATER,
    WattDateChipComponent,
    WattDropdownComponent,
    WattFormChipDirective,
    WattQueryParamsDirective,
    DhDropdownTranslatorDirective,
    DhResetFiltersButtonComponent,
  ],
  template: `
    <form
      vater-stack
      wrap
      direction="row"
      gap="s"
      tabindex="-1"
      [formGroup]="form()"
      wattQueryParams
      *transloco="let t; prefix: 'charges.charges.table.filters'"
    >
      <watt-dropdown
        [formControl]="this.form().controls.types"
        [chipMode]="true"
        [multiple]="true"
        [options]="chargeTypeOptions"
        [placeholder]="t('chargeType')"
        dhDropdownTranslator
        translateKey="charges.chargeTypes"
      />

      <watt-date-chip
        [formControl]="form().controls.activePeriodStart"
        [placeholder]="t('activePeriodStart')"
      />

      <watt-date-chip
        [formControl]="form().controls.activePeriodEnd"
        [placeholder]="t('activePeriodEnd')"
      />

      @if (selectedActor.marketRole !== 'SystemOperator') {
        <watt-dropdown
          [formControl]="this.form().controls.owners"
          [chipMode]="true"
          [multiple]="true"
          [options]="owners()"
          [placeholder]="t('owners')"
        />
      }

      <watt-dropdown
        [formControl]="this.form().controls.resolution"
        [chipMode]="true"
        [multiple]="true"
        [options]="resolutionOptions"
        [placeholder]="t('resolution')"
        dhDropdownTranslator
        translateKey="charges.resolutions"
      />

      <watt-dropdown
        [formControl]="this.form().controls.moreOptions"
        #moreOptionsDropdown
        [chipMode]="true"
        [multiple]="true"
        [hideSearch]="true"
        [options]="moreOptions()"
        [placeholder]="t('moreOptions')"
      />

      <dh-reset-filters-button />
    </form>
  `,
})
export class DhChargesFilters {
  private readonly actorStorage = inject(DhActorStorage);
  selectedActor = this.actorStorage.getSelectedActor();
  private actorOptions = getActorOptions(this.getActorsWithMarketRoles(), 'glnOrEicNumber');
  private readonly moreOptionsTranslations = translateObjectSignal(
    'charges.charges.table.moreOptions'
  );

  filter = model<ChargeOverviewQueryInput>({});
  chargeTypeOptions = dhEnumToWattDropdownOptions(ChargeType);
  resolutionOptions = dhEnumToWattDropdownOptions(ChargeResolution, ['QUARTER_HOURLY']);
  moreOptions = computed(() => this.getMoreOptions());
  owners = computed(() => {
    const options = this.actorOptions();

    if (this.selectedActor.marketRole === EicFunction.GridAccessProvider) {
      return [
        ...options,
        {
          value: this.selectedActor.gln,
          displayValue: this.selectedActor.displayName,
        },
      ];
    }

    return options;
  });

  form = computed(() => {
    return new FormGroup({
      types: dhMakeFormControl(),
      owners: dhMakeFormControl(
        this.selectedActor.marketRole === EicFunction.SystemOperator
          ? [this.selectedActor.gln]
          : null
      ),
      activePeriodStart: dhMakeFormControl<Date>(),
      activePeriodEnd: dhMakeFormControl<Date>(),
      resolution: dhMakeFormControl<ChargeResolution[]>(),
      moreOptions: dhMakeFormControl<string[] | null>(null),
    });
  });

  valuesChanges = toSignal(this.form().valueChanges, { initialValue: this.form().value });

  constructor() {
    effect(() => {
      this.filter.set({
        owners: this.valuesChanges().owners,
        types: this.valuesChanges().types,
        activePeriodStart: this.valuesChanges().activePeriodStart,
        activePeriodEnd: this.valuesChanges().activePeriodEnd,
        resolution: this.valuesChanges().resolution,
        vatInclusive: this.getOptionFilter((o) => o.vatInclusive),
        transparentInvoicing: this.getOptionFilter((o) => o.transparentInvoicing),
        spotDependingPrice: this.getOptionFilter((o) => o.spotDependingPrice),
        missingPriceSeries: this.getOptionFilter((o) => o.missingPriceSeries),
      });
    });
  }

  // Gets the boolean value for an option filter defined in `moreOptions`. When both
  // `true` and `false` exists for the same filter, then `null` is returned instead.
  private getOptionFilter = (
    selector: (input: ChargeOverviewQueryInput) => boolean | null | undefined
  ) =>
    this.valuesChanges()
      .moreOptions?.map((x) => JSON.parse(x))
      .map(selector)
      .filter((x) => x !== undefined)
      .reduce((acc, next) => (acc === !next ? null : next), null);

  private getActorsWithMarketRoles() {
    switch (this.selectedActor.marketRole) {
      case EicFunction.GridAccessProvider:
        return [EicFunction.SystemOperator];
      case EicFunction.EnergySupplier:
        return [EicFunction.SystemOperator, EicFunction.GridAccessProvider];
      case EicFunction.DataHubAdministrator:
        return [EicFunction.SystemOperator, EicFunction.GridAccessProvider];
      case EicFunction.SystemOperator:
        return [EicFunction.SystemOperator];
      default:
        return [];
    }
  }

  private getMoreOptions() {
    return [
      this.createGroupOption('vatInclusive'),
      this.createGroupOption('transparentInvoicing'),
      this.createGroupOption('spotDependingPrice'),
      this.createGroupOption('missingPriceSeries', { noInvertedOption: true }),
    ];
  }

  private createGroupOption(
    name: keyof ChargeOverviewQueryInput,
    { noInvertedOption = false } = {}
  ): WattDropdownOptionGroup<string> {
    return {
      label: this.moreOptionsTranslations()[`${name}GroupName`],
      options: [
        {
          value: JSON.stringify({ [name]: true }),
          displayValue: this.moreOptionsTranslations()[name],
        },
        ...(noInvertedOption
          ? []
          : [
              {
                value: JSON.stringify({ [name]: false }),
                displayValue: this.moreOptionsTranslations()[`not_${name}`],
              },
            ]),
      ],
    };
  }
}
