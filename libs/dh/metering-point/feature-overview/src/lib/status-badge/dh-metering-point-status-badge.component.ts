import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { ConnectionState } from '@energinet-datahub/dh/shared/data-access-api';
import { WattBadgeModule, WattBadgeType } from '@energinet-datahub/watt';
import { TranslocoModule } from '@ngneat/transloco';

import { connectionStateToBadgeType } from './connection-state-to-badge-type';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-status-badge',
  template: `<ng-container *ngIf="badgeType && connectionState">
    <watt-badge
      [type]="badgeType"
      *transloco="let t; read: 'meteringPoint.physicalStatusCode'"
      >{{ t(connectionState) }}</watt-badge
    >
  </ng-container>`,
})
export class DhStatusBadgeComponent {
  #connectionState?: ConnectionState;
  badgeType?: WattBadgeType;

  @Input()
  set connectionState(value: ConnectionState | undefined) {
    if (value == undefined) {
      return;
    }

    this.#connectionState = value;
    this.badgeType = connectionStateToBadgeType(value);
  }

  get connectionState(): ConnectionState | undefined {
    return this.#connectionState;
  }
}

@NgModule({
  declarations: [DhStatusBadgeComponent],
  exports: [DhStatusBadgeComponent],
  imports: [CommonModule, TranslocoModule, WattBadgeModule],
})
export class DhMeteringPointStatusBadgeScam {}
