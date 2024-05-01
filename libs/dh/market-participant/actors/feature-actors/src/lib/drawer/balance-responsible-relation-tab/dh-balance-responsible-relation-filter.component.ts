import { Component, DestroyRef, OnInit, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  getActorOptions,
  getGridAreaOptions,
} from '@energinet-datahub/dh/shared/data-access-graphql';
import {
  BalanceResponsibilityAgreementStatus,
  EicFunction,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDateRangeChipComponent } from '@energinet-datahub/watt/datepicker';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattFormChipDirective } from '@energinet-datahub/watt/field';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective } from '@ngneat/transloco';
import { RxPush } from '@rx-angular/template/push';
import { DhBalanceResponsibleRelationFilters } from './dh-balance-responsible-relation';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';

// Map query variables type to object of form controls type
type FormControls<T> = { [P in keyof T]: FormControl<T[P] | null> };
type Filters = FormControls<DhBalanceResponsibleRelationFilters>;

@Component({
  standalone: true,
  selector: 'dh-balance-responsible-relation-filters',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    RxPush,
    VaterStackComponent,
    WattButtonComponent,
    WattDateRangeChipComponent,
    WattFormChipDirective,
    WattDropdownComponent,
    DhDropdownTranslatorDirective,
    WattSearchComponent,
  ],
  template: ` <form
    vater-stack
    direction="row"
    gap="m"
    class="watt-space-stack-m"
    tabindex="-1"
    fill="horizontal"
    *transloco="
      let t;
      read: 'marketParticipant.actorsOverview.drawer.tabs.balanceResponsibleRelation'
    "
    [formGroup]="filterForm"
  >
    <watt-dropdown
      [placeholder]="t('status')"
      [chipMode]="true"
      [options]="statusOptions"
      [formControl]="filterForm.controls.status!"
      dhDropdownTranslator
      translate="marketParticipant.actorsOverview.drawer.tabs.balanceResponsibleRelation.statusOptions"
    />
    @if (marketRole() === eicFunction.BalanceResponsibleParty) {
      <watt-dropdown
        [placeholder]="t('energySupplier')"
        [chipMode]="true"
        [options]="energySupplierOptions$ | push"
        [formControl]="filterForm.controls.energySupplierWithNameId!"
      />
    }

    @if (marketRole() === eicFunction.EnergySupplier) {
      <watt-dropdown
        [placeholder]="t('balanceResponsible')"
        [chipMode]="true"
        [options]="balanceResponsibleOptions$ | push"
        [formControl]="filterForm.controls.balanceResponsibleWithNameId!"
      />
    }

    <watt-dropdown
      [placeholder]="t('gridArea')"
      [chipMode]="true"
      [options]="gridAreaOptions$ | push"
      [formControl]="filterForm.controls.gridAreaId!"
    />

    <watt-search [label]="t('search')" (search)="searchEvent$.next($event)" />
  </form>`,
})
export class DhBalanceResponsibleRelationFilterComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  marketRole = input.required<EicFunction>();
  inital = input.required<DhBalanceResponsibleRelationFilters>();
  filter = output<DhBalanceResponsibleRelationFilters>();

  searchEvent$ = new BehaviorSubject<string>('');

  eicFunction: typeof EicFunction = EicFunction;
  energySupplierOptions$ = getActorOptions([EicFunction.EnergySupplier], 'actorId');
  balanceResponsibleOptions$ = getActorOptions([EicFunction.BalanceResponsibleParty], 'actorId');
  gridAreaOptions$ = getGridAreaOptions();
  statusOptions: WattDropdownOptions = dhEnumToWattDropdownOptions(
    BalanceResponsibilityAgreementStatus
  );

  filterForm!: FormGroup<Filters>;

  ngOnInit(): void {
    const { status, energySupplierWithNameId, balanceResponsibleWithNameId, gridAreaId, search } =
      this.inital();
    this.filterForm = new FormGroup<Filters>({
      status: dhMakeFormControl(status),
      energySupplierWithNameId: dhMakeFormControl(energySupplierWithNameId),
      balanceResponsibleWithNameId: dhMakeFormControl(balanceResponsibleWithNameId),
      gridAreaId: dhMakeFormControl(gridAreaId),
      search: dhMakeFormControl(search),
    });

    this.filterForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.filter.emit(value as DhBalanceResponsibleRelationFilters));

    this.searchEvent$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((search) => {
      this.filterForm.patchValue({ search });
    });
  }
}
