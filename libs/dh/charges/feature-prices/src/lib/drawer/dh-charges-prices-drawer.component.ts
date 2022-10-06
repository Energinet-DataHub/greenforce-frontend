import { Component, NgModule, ViewChild } from '@angular/core';
import { ChargeV1Dto } from '@energinet-datahub/dh/shared/domain';
import { WattDrawerModule, WattDrawerComponent } from '@energinet-datahub/watt';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'dh-charges-prices-drawer',
  templateUrl: './dh-charges-prices-drawer.component.html',
  styleUrls: ['./dh-charges-prices-drawer.component.scss'],
})
export class DhChargesPricesDrawerComponent {
  @ViewChild('drawer') drawer!: WattDrawerComponent;

  charge?: ChargeV1Dto;

  openDrawer(charge: ChargeV1Dto) {
    this.charge = charge;
    this.drawer.open();
  }
}

@NgModule({
  declarations: [DhChargesPricesDrawerComponent],
  exports: [DhChargesPricesDrawerComponent],
  imports: [WattDrawerModule, TranslocoModule],
})
export class DhChargesPricesDrawerScam {}
