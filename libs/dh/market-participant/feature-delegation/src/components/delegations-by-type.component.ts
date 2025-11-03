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
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet/watt/expandable-card';
import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhDelegationsByType } from '../types';
import { DhDelegationsComponent } from './delegations.component';

@Component({
  selector: 'dh-delegations-by-type',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, WATT_EXPANDABLE_CARD_COMPONENTS, DhDelegationsComponent],
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <ng-container *transloco="let t; prefix: 'marketParticipant.delegation'">
      @for (entry of delegationsByType(); track entry.type) {
        <watt-expandable-card togglePosition="before" variant="solid">
          <watt-expandable-card-title>
            {{ t('processTypes.' + entry.type) }}
          </watt-expandable-card-title>

          <dh-delegations
            [data]="entry.delegations"
            [canManageDelegations]="!!canManageDelegations()"
          />
        </watt-expandable-card>
      }
    </ng-container>
  `,
})
export class DhDelegationsByTypeComponent {
  private readonly permissionService = inject(PermissionService);

  delegationsByType = input.required<DhDelegationsByType>();

  canManageDelegations = toSignal(this.permissionService.hasPermission('delegation:manage'));
}
