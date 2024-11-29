import { Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_LINK_TABS } from '@energinet-datahub/watt/tabs';
import { ESettSubPaths, combinePaths } from '@energinet-datahub/dh/core/routing';

@Component({
  selector: 'dh-esett-shell',
  standalone: true,
  template: `
    <watt-link-tabs *transloco="let t; read: 'eSett.tabs'">
      <watt-link-tab
        [label]="t('outgoingMessages.tabLabel')"
        [link]="getLink('outgoing-messages')"
      />
      <watt-link-tab
        [label]="t('meteringGridareaImbalance.tabLabel')"
        [link]="getLink('metering-gridarea-imbalance')"
      />
      <watt-link-tab
        [label]="t('balanceResponsible.tabLabel')"
        [link]="getLink('balance-responsible')"
      />
      ></watt-link-tabs
    >
  `,
  imports: [TranslocoDirective, WATT_LINK_TABS],
})
export class DhESettShellComponent {
  getLink = (path: ESettSubPaths) => combinePaths('esett', path);
}
