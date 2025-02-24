//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
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
//#endregion
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { ConnectionState } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-metering-point-status',
  imports: [TranslocoDirective, WattBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: contents;
    }
  `,
  template: `
    <ng-container *transloco="let t; read: 'meteringPoint.overview.status'">
      @let statusView = status();

      @switch (statusView) {
        @case ('CLOSED_DOWN') {
          <watt-badge type="danger">{{ t(statusView!) }}</watt-badge>
        }
        @case ('NEW') {
          <watt-badge type="info">{{ t(statusView!) }}</watt-badge>
        }
        @case ('CONNECTED') {
          <watt-badge type="success">{{ t(statusView) }}</watt-badge>
        }
        @case ('DISCONNECTED') {
          <watt-badge type="neutral">{{ t(statusView) }}</watt-badge>
        }
      }
    </ng-container>
  `,
})
export class DhMeteringPointStatusComponent {
  status = input<ConnectionState>();
}
