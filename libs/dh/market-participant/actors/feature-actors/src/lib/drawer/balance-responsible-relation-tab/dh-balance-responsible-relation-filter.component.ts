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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, DestroyRef, OnInit, effect, inject, input, output } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { RxPush } from '@rx-angular/template/push';
import { TranslocoDirective } from '@ngneat/transloco';

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

import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { WattFormChipDirective } from '@energinet-datahub/watt/field';
import { WattDateRangeChipComponent } from '@energinet-datahub/watt/datepicker';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { DhBalanceResponsibleRelationFilters } from './dh-balance-responsible-relation';

// Map query variables type to object of form controls type
type FormControls<T> = { [P in keyof T]: FormControl<T[P] | null> };
type Filters = FormControls<Omit<DhBalanceResponsibleRelationFilters, 'actorId' | 'eicFunction'>>;

@Component({
  standalone: true,
  selector: 'dh-balance-responsible-relation-filters',
  imports: [
    RxPush,
    ReactiveFormsModule,
    TranslocoDirective,

    VaterStackComponent,
    VaterSpacerComponent,

    WattButtonComponent,
    WattSearchComponent,
    WattDropdownComponent,
    WattFormChipDirective,
    WattDateRangeChipComponent,

    DhDropdownTranslatorDirective,
  ],
  styles: `
    :host {
      width: 100%;
    }
  `,
  template: ` <form
    vater-stack
    direction="row"
    gap="m"
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
    <vater-spacer />
    <watt-search [label]="t('search')" (search)="searchEvent$.next($event)" />
  </form>`,
})
export class DhBalanceResponsibleRelationFilterComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  marketRole = input.required<EicFunction>();
  inital = input.required<DhBalanceResponsibleRelationFilters>();
  filter = output<Partial<DhBalanceResponsibleRelationFilters>>();

  searchEvent$ = new BehaviorSubject<string>('');

  eicFunction: typeof EicFunction = EicFunction;
  energySupplierOptions$ = getActorOptions([EicFunction.EnergySupplier], 'actorId');
  balanceResponsibleOptions$ = getActorOptions([EicFunction.BalanceResponsibleParty], 'actorId');
  gridAreaOptions$ = getGridAreaOptions();
  statusOptions: WattDropdownOptions = dhEnumToWattDropdownOptions(
    BalanceResponsibilityAgreementStatus
  );

  filterForm!: FormGroup<Filters>;

  constructor() {
    effect(() => {
      const { status, energySupplierWithNameId, balanceResponsibleWithNameId, gridAreaId, search } =
        this.inital();

      this.filterForm.patchValue(
        {
          status: status ?? null,
          energySupplierWithNameId: energySupplierWithNameId ?? null,
          balanceResponsibleWithNameId: balanceResponsibleWithNameId ?? null,
          gridAreaId: gridAreaId ?? null,
          search: search ?? null,
        },
        { emitEvent: false }
      );
    });
  }

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
      .subscribe((value) =>
        this.filter.emit(value as Partial<DhBalanceResponsibleRelationFilters>)
      );

    this.searchEvent$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((search) => {
      this.filterForm.patchValue({ search: search === '' ? null : search });
    });
  }
}
