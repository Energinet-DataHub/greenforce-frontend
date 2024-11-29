import { Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_LINK_TABS } from '@energinet-datahub/watt/tabs';
import { AdminSubPaths, combinePaths } from '@energinet-datahub/dh/core/routing';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

@Component({
  selector: 'dh-admin-shell',
  standalone: true,
  template: `
    <watt-link-tabs *transloco="let t; read: 'admin.userManagement.tabs'">
      <watt-link-tab [label]="t('users.tabLabel')" [link]="getLink('users')" />
      <watt-link-tab [label]="t('roles.tabLabel')" [link]="getLink('roles')" />
      <watt-link-tab
        *dhPermissionRequired="['fas']"
        [label]="t('permissions.tabLabel')"
        [link]="getLink('permissions')"
      />
    </watt-link-tabs>
  `,
  imports: [TranslocoDirective, DhPermissionRequiredDirective, WATT_LINK_TABS],
})
export class DhAdminShellComponent {
  getLink = (path: AdminSubPaths) => combinePaths('admin', path);
}
