import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideComponentStore } from '@ngrx/component-store';
import { LetModule } from '@rx-angular/template';

import { DhAdminUserManagementDataAccessApiStore } from '@energinet-datahub/dh/admin/data-access-api';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';

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
  imports: [CommonModule, LetModule, WattSpinnerModule, DhUsersTabComponent],
})
export class DhUsersTabContainerComponent {
  private readonly store = inject(DhAdminUserManagementDataAccessApiStore);

  users$ = this.store.users$;
  isLoading$ = this.store.isLoading$;
  hasGeneralError$ = this.store.hasGeneralError$;
}
