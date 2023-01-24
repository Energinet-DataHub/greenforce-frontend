import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserOverviewItemDto } from '@energinet-datahub/dh/shared/domain';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { TranslocoModule } from '@ngneat/transloco';
import { WattTabsModule } from '@energinet-datahub/watt/tabs';
import {
  WattModalComponent,
  WattModalModule,
} from '@energinet-datahub/watt/modal';

@Component({
  selector: 'dh-edit-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    WattModalModule,
    WattButtonModule,
    TranslocoModule,
    WattTabsModule,
  ],
  templateUrl: './dh-edit-user-modal.component.component.html',
  styleUrls: ['./dh-edit-user-modal.component.component.scss'],
})
export class DhEditUserModalComponentComponent {
  user: UserOverviewItemDto | null = null;
  @ViewChild('editUserModal') editUserModal!: WattModalComponent;

  open(user: UserOverviewItemDto | null): void {
    this.user = user;
    this.editUserModal.open();
  }

  save(): void {
    // TODO: Save user
  }

  deactivedUser(): void {
    // TODO: Deactivate user
  }
}
