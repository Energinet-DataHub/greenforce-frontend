import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';

@Component({
  selector: 'dh-user-status',
  standalone: true,
  template: `<ng-container
    *transloco="let t; read: 'admin.userManagement.tabs.users.userStatus'"
  >
    <watt-badge *ngIf="isActive" type="info">{{ t('active') }}</watt-badge>

    <watt-badge *ngIf="!isActive" type="warning">{{
      t('inactive')
    }}</watt-badge>
  </ng-container>`,
  imports: [CommonModule, TranslocoModule, WattBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhUserStatusComponent {
  @Input() isActive!: boolean;
}
