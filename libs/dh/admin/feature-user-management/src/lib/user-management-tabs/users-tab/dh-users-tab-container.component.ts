import { Component } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';

import { DhAdminUserManagementDataAccessApiStore } from '@energinet-datahub/dh/admin/data-access-api';

import { DhUsersTabComponent } from './dh-users-tab.component';

@Component({
  selector: 'dh-users-tab-container',
  standalone: true,
  templateUrl: 'dh-users-tab-container.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  providers: [provideComponentStore(DhAdminUserManagementDataAccessApiStore)],
  imports: [DhUsersTabComponent],
})
export class DhUsersTabContainerComponent {}
