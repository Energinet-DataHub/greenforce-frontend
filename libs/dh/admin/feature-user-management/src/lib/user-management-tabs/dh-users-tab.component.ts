import { Component, inject } from '@angular/core';
import { PushModule } from '@rx-angular/template';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import { WattCardModule } from '@energinet-datahub/watt/card';
import { DhAdminUserManagementDataAccessApiStore } from '@energinet-datahub/dh/admin/data-access-api';

@Component({
  selector: 'dh-users-tab',
  templateUrl: './dh-users-tab.component.html',
  styleUrls: ['./dh-users-tab.component.scss'],
  standalone: true,
  providers: [DhAdminUserManagementDataAccessApiStore],
  imports: [CommonModule, PushModule, TranslocoModule, WattCardModule],
})
export class DhUsersTabComponent {
  private store = inject(DhAdminUserManagementDataAccessApiStore);

  numberOfUsers$ = this.store.numberOfUsers$;
}
