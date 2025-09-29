import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'dh-prices',
  template: ` <h1>Prices</h1> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhPricesComponent {}
