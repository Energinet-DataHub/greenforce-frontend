import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { map } from 'rxjs';
import { PushModule } from '@rx-angular/template/push';

import { WattButtonModule } from '@energinet-datahub/watt/button';
import {
  WattModalComponent,
  WattModalModule,
} from '@energinet-datahub/watt/modal';
import { WattTabsModule } from '@energinet-datahub/watt/tabs';
import { DhAdminUserRoleWithPermissionsManagementDataAccessApiStore } from '@energinet-datahub/dh/admin/data-access-api';

@Component({
  selector: 'dh-edit-user-role-modal',
  templateUrl: './dh-edit-user-role-modal.component.html',
  standalone: true,
  imports: [
    CommonModule,
    PushModule,
    WattModalModule,
    WattButtonModule,
    TranslocoModule,
    WattTabsModule,
  ],
})
export class DhEditUserRoleModalComponent implements AfterViewInit {
  private readonly store = inject(
    DhAdminUserRoleWithPermissionsManagementDataAccessApiStore
  );

  roleName$ = this.store.userRole$.pipe(map((role) => role?.name ?? ''));

  @ViewChild(WattModalComponent) editUserRoleModal!: WattModalComponent;

  @Output() closed = new EventEmitter<void>();

  ngAfterViewInit(): void {
    this.editUserRoleModal.open();
  }

  closeModal(): void {
    this.editUserRoleModal.close(true);
    this.closed.emit();
  }
}
