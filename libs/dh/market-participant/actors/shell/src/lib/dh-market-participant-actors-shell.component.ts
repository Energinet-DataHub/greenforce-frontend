import { Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_LINK_TABS } from '@energinet-datahub/watt/tabs';
import { MarketParticipantSubPaths, combinePaths } from '@energinet-datahub/dh/core/routing';

@Component({
  selector: 'dh-market-participant-actors-shell',
  standalone: true,
  template: `
    <ng-container *transloco="let t; read: 'marketParticipant.actors.tabs'">
      <watt-link-tabs>
        <watt-link-tab [label]="t('actors.tabLabel')" [link]="getLink('actors')" />
        <watt-link-tab [label]="t('organizations.tabLabel')" [link]="getLink('organizations')" />
        <watt-link-tab [label]="t('marketRoles.tabLabel')" [link]="getLink('market-roles')" />
      </watt-link-tabs>
    </ng-container>
  `,
  imports: [TranslocoDirective, WATT_LINK_TABS],
})
export class DhMarketParticipantActorsShellComponent {
  getLink = (path: MarketParticipantSubPaths) => combinePaths('market-participant', path);
}
