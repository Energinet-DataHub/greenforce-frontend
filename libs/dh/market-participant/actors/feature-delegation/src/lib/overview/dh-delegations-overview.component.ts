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
