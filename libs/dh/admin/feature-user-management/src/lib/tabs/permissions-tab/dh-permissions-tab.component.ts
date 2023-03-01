import { Component } from '@angular/core';
import { DhAdminPermissionOverviewComponent } from '@energinet-datahub/dh/admin/feature-permissions';

@Component({
  standalone: true,
  selector: 'dh-permissions-tab',
  template: ` <dh-admin-permission-overview></dh-admin-permission-overview>`,
  styles: [``],
  imports: [DhAdminPermissionOverviewComponent],
})
export class DhPermissionsTabComponent {}
