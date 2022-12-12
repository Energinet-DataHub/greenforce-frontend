import { Component, inject } from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { PushModule } from '@rx-angular/template';

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
  imports: [PushModule, DhUsersTabComponent],
})
export class DhUsersTabContainerComponent {
  private readonly store = inject(DhAdminUserManagementDataAccessApiStore);

  users$ = this.store.users$;
}
