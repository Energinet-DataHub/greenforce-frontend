import { Component, inject, input } from '@angular/core';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { WATT_DRAWER } from '@energinet/watt/drawer';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'dh-charge-link-details',
  imports: [WATT_DRAWER, TranslocoDirective],
  template: `
    <watt-drawer
      autoOpen
      size="small"
      [key]="id()"
      *transloco="let t; prefix: 'devExamples.processes'"
      (closed)="navigation.navigate('list')"
    >
      <watt-drawer-content> placeholder for ChargeLink Details Component </watt-drawer-content>
    </watt-drawer>
  `,
})
export default class DhChargeLinkDetails {
  navigation = inject(DhNavigationService);
  id = input.required<string>();
}
