import { Component, ViewEncapsulation } from '@angular/core';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  selector: 'dh-wholesale-settlements-reports-tab',
  templateUrl: './dh-wholesale-settlements-reports-tab.component.html',
  styleUrls: ['./dh-wholesale-settlements-reports-tab.component.scss'],
  imports: [WATT_TABS, WattCardModule, TranslocoModule],
})
export class DhWholesaleSettlementsReportsTabComponent {}
