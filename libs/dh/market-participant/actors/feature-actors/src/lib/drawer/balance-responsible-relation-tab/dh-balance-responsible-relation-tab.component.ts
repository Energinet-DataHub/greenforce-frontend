import { Component, EventEmitter, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  standalone: true,
  selector: 'dh-balance-responsible-relation-tab',
  template: ` <form
    vater-stack
    direction="row"
    gap="m"
    tabindex="-1"
    [formGroup]="filterForm"
    *transloco="
      let t;
      read: 'marketParticipant.actorsOverview.drawer.tabs.balanceResponsibleRelation'
    "
  >
    <watt-dropdown
      [placeholder]="t('status')"
      [chipMode]="true"
      [options]="statusOptions"
      [formControl]="filterForm.controls.status"
    />
    <watt-dropdown
      [placeholder]="t('energySupplier')"
      [chipMode]="true"
      [options]="energySupplierOptions"
      [formControl]="filterForm.controls.energySupplier"
    />
    <watt-dropdown
      [placeholder]="t('gridArea')"
      [chipMode]="true"
      [options]="gridAreaOptions"
      [formControl]="filterForm.controls.gridArea"
    />
    <watt-search #searchComponent [label]="t('search')" (search)="(searchEvent)" />
  </form>`,
  styles: `:host {
    watt-search {
      margin-left: auto;
    }
  }`,
  imports: [
    ReactiveFormsModule,
    VaterStackComponent,
    WattDropdownComponent,
    WattSearchComponent,
    TranslocoDirective,
  ],
})
export class DhBalanceResponsibleRelationTabComponent {
  private fb = inject(NonNullableFormBuilder);

  statusOptions: WattDropdownOptions = [{ value: 'active', displayValue: 'Active' }];
  energySupplierOptions: WattDropdownOptions = [];
  gridAreaOptions: WattDropdownOptions = [];
  searchEvent = new EventEmitter<string>();

  filterForm = this.fb.group({ status: [], energySupplier: [], gridArea: [] });
}
