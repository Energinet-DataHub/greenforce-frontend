import { Component, computed, effect, inject, model, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { getActorOptions } from '@energinet-datahub/dh/shared/data-access-graphql';
import {
  ChargeStatus,
  ChargeType,
  EicFunction,
  GetChargesQueryInput,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhActorStorage } from '@energinet-datahub/dh/shared/feature-authorization';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattQueryParamsDirective } from '@energinet-datahub/watt/query-params';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import {
  translate,
  translateObjectSignal,
  translateSignal,
  TranslocoDirective,
} from '@jsverse/transloco';
import { WattDropdownOptionGroup } from 'libs/watt/package/dropdown/watt-dropdown-option';

@Component({
  selector: 'dh-charges-filters',
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    WattDropdownComponent,
    VaterStackComponent,
    WattQueryParamsDirective,
    DhDropdownTranslatorDirective,
  ],
  template: `
    <form
      vater-stack
      scrollable
      direction="row"
      gap="s"
      tabindex="-1"
      [formGroup]="form()"
      wattQueryParams
      *transloco="let t; prefix: 'charges.charges.table.filters'"
    >
      <watt-dropdown
        [formControl]="this.form().controls.chargeTypes"
        [chipMode]="true"
        [multiple]="true"
        [options]="chargeTypeOptions"
        [placeholder]="t('chargeType')"
        dhDropdownTranslator
        translateKey="charges.charges.chargeTypes"
      />

      <watt-dropdown
        [formControl]="this.form().controls.actorNumbers"
        [chipMode]="true"
        [multiple]="true"
        [options]="owners()"
        [placeholder]="t('owners')"
      />

      <watt-dropdown
        [formControl]="this.form().controls.statuses"
        [chipMode]="true"
        [multiple]="true"
        [options]="statusOptions"
        [placeholder]="t('status')"
        dhDropdownTranslator
        translateKey="charges.charges.table.chargeStatus"
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
    </form>
  `,
})
export class DhChargesFiltersComponent {
  private readonly actorStorage = inject(DhActorStorage);
  private readonly marketRole = this.actorStorage.getSelectedActor().marketRole;
  private readonly moreOptionsTranslations = translateObjectSignal(
    'charges.charges.table.moreOptions'
  );
  chargeTypeOptions = dhEnumToWattDropdownOptions(ChargeType);
  statusOptions = dhEnumToWattDropdownOptions(ChargeStatus, [ChargeStatus.Invalid]);
  owners = getActorOptions(this.getActorsWithMarketRoles(), 'actorId');
  moreOptions = computed(() => this.getMoreOptions());

  filter = model<GetChargesQueryInput>({});

  form = computed(() => {
    const initial = untracked(() => this.filter());
    return new FormGroup({
      chargeTypes: dhMakeFormControl(),
      actorNumbers: dhMakeFormControl(),
      statuses: dhMakeFormControl(initial.statuses),
      moreOptions: dhMakeFormControl<string[] | null>(null),
    });
  });

  valuesChanges = toSignal(this.form().valueChanges, { initialValue: this.form().value });

  constructor() {
    effect(() => {
      this.filter.set(this.valuesChanges());
    });
  }

  private getActorsWithMarketRoles() {
    switch (this.marketRole) {
      case EicFunction.GridAccessProvider:
        return [EicFunction.SystemOperator, EicFunction.GridAccessProvider];
      case EicFunction.EnergySupplier:
        return [EicFunction.SystemOperator, EicFunction.EnergySupplier];
      case EicFunction.DataHubAdministrator:
        return [
          EicFunction.SystemOperator,
          EicFunction.GridAccessProvider,
          EicFunction.EnergySupplier,
        ];
      default:
        return [];
    }
  }

  private getMoreOptions(): WattDropdownOptionGroup[] {
    return [
      this.createGroupOption('vat'),
      this.createGroupOption('transparentInvoicing'),
      this.createGroupOption('predictablePrice'),
    ];
  }

  private createGroupOption(name: string): WattDropdownOptionGroup {
    return {
      name,
      label: this.moreOptionsTranslations()[`${name}GroupName`],
      options: [
        {
          value: `${name}-true`,
          displayValue: this.moreOptionsTranslations()[`with${capitalize(name)}`],
        },
        {
          value: `${name}-false`,
          displayValue: this.moreOptionsTranslations()[`without${capitalize(name)}`],
        },
      ],
    };
  }
}

function capitalize(name: string): string {
  if (!name || name.length === 0) return name;
  return name.charAt(0).toUpperCase() + name.slice(1);
}
