/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
