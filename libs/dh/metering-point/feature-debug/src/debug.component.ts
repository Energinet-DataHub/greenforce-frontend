import { Component } from '@angular/core';
import { getPath, MeteringPointDebugSubPaths } from '@energinet-datahub/dh/core/routing';
import { WATT_LINK_TABS } from '@energinet-datahub/watt/tabs';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  selector: 'dh-metering-point-debug',
  imports: [TranslocoDirective, WATT_LINK_TABS, VaterUtilityDirective],
  template: `
    <watt-link-tabs vater inset="0" *transloco="let t; read: 'meteringPointDebug'">
      <watt-link-tab [label]="t('meteringPoint.tabLabel')" [link]="getLink('metering-point')" />
      <watt-link-tab [label]="t('meteringPoints.tabLabel')" [link]="getLink('metering-points')" />
    </watt-link-tabs>
  `,
})
export class DhMeteringPointDebugComponent {
  getLink = (path: MeteringPointDebugSubPaths) => getPath(path);
}
