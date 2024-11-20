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
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
} from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';
import { PermissionService } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhDelegationsByType } from '../dh-delegations';
import { DhDelegationTableComponent } from '../table/dh-delegation-table.componen';

@Component({
  selector: 'dh-delegations-overview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, WATT_EXPANDABLE_CARD_COMPONENTS, DhDelegationTableComponent],
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <ng-container *transloco="let t; read: 'marketParticipant.delegation'">
      @for (entry of delegationsByType(); track entry.type) {
        <watt-expandable-card togglePosition="before" variant="solid">
          <watt-expandable-card-title>
            {{ t('processTypes.' + entry.type) }}
          </watt-expandable-card-title>

          <dh-delegation-table
            [data]="entry.delegations"
            [canManageDelegations]="!!canManageDelegations()"
          />
        </watt-expandable-card>
      }
    </ng-container>
  `,
})
export class DhDelegationsOverviewComponent {
  private readonly permissionService = inject(PermissionService);

  delegationsByType = input.required<DhDelegationsByType>();

  canManageDelegations = toSignal(this.permissionService.hasPermission('delegation:manage'));
}
