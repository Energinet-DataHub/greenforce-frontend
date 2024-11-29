import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, DestroyRef, OnInit, computed, inject, input, output } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { RxPush } from '@rx-angular/template/push';
import { TranslocoDirective } from '@ngneat/transloco';

import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';

import {
  BalanceResponsibilityAgreementStatus,
  EicFunction,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  getActorOptions,
  getGridAreaOptions,
} from '@energinet-datahub/dh/shared/data-access-graphql';

import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';

import { DhBalanceResponsibleRelationFilters } from './dh-balance-responsible-relation';

// Map query variables type to object of form controls type
type FormControls<T> = { [P in keyof T]: FormControl<T[P] | null> };
type Filters = FormControls<DhBalanceResponsibleRelationFilters>;

@Component({
  standalone: true,
  selector: 'dh-balance-responsible-relation-filters',
  imports: [
    RxPush,
    ReactiveFormsModule,
    TranslocoDirective,

    VaterStackComponent,
    VaterSpacerComponent,

    WattSearchComponent,
    WattDropdownComponent,

    DhDropdownTranslatorDirective,
  ],
  styles: `
    :host {
      width: 85%;
    }
  `,
  template: `<form
    vater-stack
    direction="row"
    gap="s"
    tabindex="-1"
    fill="horizontal"
    *transloco="
      let t;
      read: 'marketParticipant.actorsOverview.drawer.tabs.balanceResponsibleRelation'
    "
    [formGroup]="filtersForm"
  >
    <watt-dropdown
      [placeholder]="t('status')"
      [chipMode]="true"
      [multiple]="true"
      [options]="statusOptions"
      [formControl]="filtersForm.controls.status!"
      dhDropdownTranslator
      translateKey="marketParticipant.actorsOverview.drawer.tabs.balanceResponsibleRelation.statusOptions"
    />

    @if (marketRole() === eicFunction.BalanceResponsibleParty) {
      <watt-dropdown
        [placeholder]="t('energySupplier')"
        [chipMode]="true"
        [options]="energySupplierOptions$ | push"
        [formControl]="filtersForm.controls.energySupplierWithNameId!"
      />
    }

    @if (marketRole() === eicFunction.EnergySupplier) {
      <watt-dropdown
        [placeholder]="t('balanceResponsible')"
        [chipMode]="true"
        [options]="balanceResponsibleOptions$ | push"
        [formControl]="filtersForm.controls.balanceResponsibleWithNameId!"
      />
    }

    <watt-dropdown
      [placeholder]="t('gridArea')"
      [chipMode]="true"
      [options]="gridAreaOptions$ | push"
      [formControl]="filtersForm.controls.gridAreaCode!"
    />

    <vater-spacer />

    <watt-search [label]="t('search')" (search)="searchEvent$.next($event)" />
  </form>`,
})
export class DhBalanceResponsibleRelationFilterComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  actor = input.required<DhActorExtended>();
  marketRole = computed(() => this.actor().marketRole);

  filtersChanges = output<Partial<DhBalanceResponsibleRelationFilters>>();

  searchEvent$ = new BehaviorSubject<string>('');

  eicFunction: typeof EicFunction = EicFunction;
  energySupplierOptions$ = getActorOptions([EicFunction.EnergySupplier], 'actorId');
  balanceResponsibleOptions$ = getActorOptions([EicFunction.BalanceResponsibleParty], 'actorId');
  gridAreaOptions$ = getGridAreaOptions();
  statusOptions: WattDropdownOptions = dhEnumToWattDropdownOptions(
    BalanceResponsibilityAgreementStatus
  );

  filtersForm = new FormGroup<Filters>({
    status: dhMakeFormControl(),
    energySupplierWithNameId: dhMakeFormControl(),
    balanceResponsibleWithNameId: dhMakeFormControl(),
    gridAreaCode: dhMakeFormControl(),
    search: dhMakeFormControl(),
  });

  constructor() {
    toObservable(this.actor)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.filtersForm.reset());
  }

  ngOnInit(): void {
    this.filtersForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) =>
        this.filtersChanges.emit(value as Partial<DhBalanceResponsibleRelationFilters>)
      );

    this.searchEvent$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.filtersForm.patchValue({ search: value === '' ? null : value });
    });
  }
}
