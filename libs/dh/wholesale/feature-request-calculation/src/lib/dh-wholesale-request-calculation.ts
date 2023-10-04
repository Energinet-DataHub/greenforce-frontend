import { Component } from '@angular/core';
import { WATT_CARD } from '@energinet-datahub/watt/card';

@Component({
  selector: 'dh-wholesale-request-calculation',
  templateUrl: './dh-wholesale-request-calculation.html',
  standalone: true,
  imports: [WATT_CARD],
})
export class DhWholesaleRequestCalculationComponent {}
