import { Component } from '@angular/core';
import { DhCommercialRelationsComponent } from './commercial-relations.component';
import { DhMeteringPointsComponent } from './metering-points.component';
import { WATT_TABS } from '@energinet-datahub/watt/tabs';

@Component({
  selector: 'dh-metering-point',
  imports: [DhCommercialRelationsComponent, DhMeteringPointsComponent, WATT_TABS],
  template: `
    <watt-tabs>
      <watt-tab label="Metering points">
        <dh-metering-points />
      </watt-tab>
      <watt-tab label="Commercial relations">
        <dh-commercial-relations />
      </watt-tab>
    </watt-tabs>
  `,
})
export class DhMeteringPointComponent {}
