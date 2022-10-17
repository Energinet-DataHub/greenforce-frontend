import { Component, NgModule } from '@angular/core';
import { DhDrawerDatepickerScam } from '../drawer-datepicker/dh-drawer-datepicker.component';
import { DatePickerData } from '../drawer-datepicker/drawer-datepicker.service';

@Component({
  selector: 'dh-charges-prices-history-tab',
  templateUrl: './dh-charges-prices-history-tab.component.html',
  styleUrls: ['./dh-charges-prices-history-tab.component.scss'],
})
export class DhChargesPricesHistoryTabComponent {
  dateRangeChanged(dateRange: DatePickerData) {
    console.log(dateRange);
  }
}

@NgModule({
  declarations: [DhChargesPricesHistoryTabComponent],
  exports: [DhChargesPricesHistoryTabComponent],
  imports: [DhDrawerDatepickerScam],
})
export class DhChargesPricesHistoryTabScam {}
