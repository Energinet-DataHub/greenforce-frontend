import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { WattDrawerComponent, WattDrawerModule } from '@energinet-datahub/watt/drawer';
import { TranslocoModule } from '@ngneat/transloco';
import { CommonModule } from '@angular/common';
import { graphql } from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-admin-permission-detail',
  standalone: true,
  templateUrl: './dh-admin-permission-detail.component.html',
  styleUrls: ['./dh-admin-permission-detail.component.scss'],
  imports: [CommonModule, WattDrawerModule, TranslocoModule],
})
export class DhAdminPermissionDetailComponent {
  @ViewChild('drawer')
  drawer!: WattDrawerComponent;
  selectedPermission: graphql.Permission | null = null;

  @Output() closed = new EventEmitter<void>();

  onClose(): void {
    this.drawer.close();
    this.closed.emit();
    this.selectedPermission = null;
  }

  open(permission: graphql.Permission): void {
    console.log({ permission });
    this.selectedPermission = permission;
    this.drawer.open();
  }
}
