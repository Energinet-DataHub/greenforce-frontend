import { Component, EventEmitter, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { TranslocoDirective } from '@ngneat/transloco';

import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';

@Component({
  standalone: true,
  selector: 'dh-balance-responsible-relation-tab',
  templateUrl: './dh-balance-responsible-relation-tab.component.html',
  styles: `:host {
    watt-search {
      margin-left: auto;
    }
  }`,
  imports: [
    ReactiveFormsModule,
    VaterStackComponent,
    VaterFlexComponent,
    WattDropdownComponent,
    WattSearchComponent,
    WATT_EXPANDABLE_CARD_COMPONENTS,
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
