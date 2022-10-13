import { Component, NgModule } from '@angular/core';
import { DhDrawerDatepickerScam } from '../drawer-datepicker/dh-drawer-datepicker.component';

@Component({
  selector: 'dh-charges-prices-history-tab',
  templateUrl: './dh-charges-prices-history-tab.component.html',
  styleUrls: ['./dh-charges-prices-history-tab.component.scss']
})
export class DhChargesPricesHistoryTabComponent {}

@NgModule({
  declarations: [DhChargesPricesHistoryTabComponent],
  exports: [DhChargesPricesHistoryTabComponent],
  imports: [DhDrawerDatepickerScam],
})

export class DhChargesPricesHistoryTabScam {}
