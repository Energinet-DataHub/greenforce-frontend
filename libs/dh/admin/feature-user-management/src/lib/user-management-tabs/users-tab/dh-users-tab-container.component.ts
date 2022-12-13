import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideComponentStore } from '@ngrx/component-store';
import { LetModule } from '@rx-angular/template';

import { DhAdminUserManagementDataAccessApiStore } from '@energinet-datahub/dh/admin/data-access-api';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';

import { DhUsersTabComponent } from './dh-users-tab.component';
import { DhUsersTabGeneralErrorComponent } from './general-error/dh-users-tab-general-error.component';

@Component({
  selector: 'dh-users-tab-container',
  standalone: true,
  templateUrl: './dh-users-tab-container.component.html',
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      :host {
        background-color: var(--watt-color-neutral-white);
        display: block;
      }

      .users-overview {
        &__spinner {
          display: flex;
          justify-content: center;
          padding: var(--watt-space-l) 0;
        }

        &__error {
          padding: var(--watt-space-xl) 0;
        }
      }
    `,
  ],
  providers: [provideComponentStore(DhAdminUserManagementDataAccessApiStore)],
  imports: [
    CommonModule,
    LetModule,
    WattSpinnerModule,
    DhUsersTabComponent,
    DhUsersTabGeneralErrorComponent,
  ],
})
export class DhUsersTabContainerComponent {
  private readonly store = inject(DhAdminUserManagementDataAccessApiStore);

  users$ = this.store.users$;
  isLoading$ = this.store.isLoading$;
  hasGeneralError$ = this.store.hasGeneralError$;

  reloadUsers(): void {
    this.store.getUsers();
  }
}
