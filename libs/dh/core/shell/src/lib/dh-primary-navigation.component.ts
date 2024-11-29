import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattNavListComponent, WattNavListItemComponent } from '@energinet-datahub/watt/shell';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { WholesaleSubPaths, combinePaths, BasePaths } from '@energinet-datahub/dh/core/routing';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-primary-navigation',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  templateUrl: './dh-primary-navigation.component.html',
  standalone: true,
  imports: [
    TranslocoDirective,

    WattNavListComponent,
    WattNavListItemComponent,
    DhPermissionRequiredDirective,
  ],
})
export class DhPrimaryNavigationComponent {
  getLink(route: BasePaths) {
    return `/${route}`;
  }
  getWholesaleLink = (path: WholesaleSubPaths) => combinePaths('wholesale', path);
}
