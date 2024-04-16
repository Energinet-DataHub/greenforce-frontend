import { Component, EventEmitter, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import {
  WATT_EXPANDABLE_CARD_COMPONENTS,
  WattExpandableCardComponent,
} from '@energinet-datahub/watt/expandable-card';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  standalone: true,
  selector: 'dh-balance-responsible-relation-tab',
  template: `
    <vater-flex
      fill="horizontal"
      justify="center"
      align="flex-start"
      *transloco="
        let t;
        read: 'marketParticipant.actorsOverview.drawer.tabs.balanceResponsibleRelation'
      "
    >
      <form
        vater-stack
        direction="row"
        gap="m"
        class="watt-space-stack-m"
        tabindex="-1"
        fill="horizontal"
        [formGroup]="filterForm"
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
      </form>
      <watt-expandable-card togglePosition="before" variant="solid">
        <watt-expandable-card-title>
          {{ t('usage') }}
        </watt-expandable-card-title>
      </watt-expandable-card>
      <watt-expandable-card togglePosition="before" variant="solid">
        <watt-expandable-card-title>
          {{ t('production') }}
        </watt-expandable-card-title>
      </watt-expandable-card>
    </vater-flex>
  `,
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
