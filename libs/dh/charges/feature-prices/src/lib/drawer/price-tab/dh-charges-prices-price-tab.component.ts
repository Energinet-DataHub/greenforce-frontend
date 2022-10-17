import { Component, NgModule } from '@angular/core';
import { DhDrawerDatepickerScam } from '../drawer-datepicker/dh-drawer-datepicker.component';
import { DatePickerData } from '../drawer-datepicker/drawer-datepicker.service';

@Component({
  selector: 'dh-charges-prices-price-tab',
  templateUrl: './dh-charges-prices-price-tab.component.html',
  styleUrls: ['./dh-charges-prices-price-tab.component.scss'],
})
export class DhChargesPricesPriceTabComponent {
  dateRangeChanged(dateRange: DatePickerData) {
    console.log(dateRange);
  }
}

@NgModule({
  declarations: [DhChargesPricesPriceTabComponent],
  exports: [DhChargesPricesPriceTabComponent],
  imports: [DhDrawerDatepickerScam],
})
export class DhChargesPricesPriceTabScam {}
