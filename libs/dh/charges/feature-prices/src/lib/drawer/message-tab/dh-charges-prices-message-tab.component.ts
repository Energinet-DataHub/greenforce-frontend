import { Component, NgModule } from '@angular/core';
import { DhDrawerDatepickerScam } from '../drawer-datepicker/dh-drawer-datepicker.component';
import { DatePickerData } from '../drawer-datepicker/drawer-datepicker.service';

@Component({
  selector: 'dh-charges-prices-message-tab',
  templateUrl: './dh-charges-prices-message-tab.component.html',
  styleUrls: ['./dh-charges-prices-message-tab.component.scss'],
})
export class DhChargesPricesMessageTabComponent {
  dateRangeChanged(dateRange: DatePickerData) {
    console.log(dateRange);
  }
}

@NgModule({
  declarations: [DhChargesPricesMessageTabComponent],
  exports: [DhChargesPricesMessageTabComponent],
  imports: [DhDrawerDatepickerScam],
})
export class DhChargesPricesMessageTabScam {}
