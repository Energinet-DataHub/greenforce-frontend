import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  Signal,
  computed,
  input,
} from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';

import { DhDelegationsByType } from '../dh-delegations';

@Component({
  selector: 'dh-delegations-overview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,

    VaterStackComponent,
    WattButtonComponent,
    WATT_EXPANDABLE_CARD_COMPONENTS,
  ],
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <ng-container *transloco="let t; read: 'marketParticipant.delegation'">
      <vater-stack direction="row" justify="flex-end" class="watt-space-stack-m">
        <watt-button (click)="setUpDelegation.emit()" variant="secondary">
          {{ t('setUpDelegation') }}
        </watt-button>
      </vater-stack>

      @if (outgoing().length > 0) {
        <watt-expandable-card togglePosition="before" variant="solid">
          <watt-expandable-card-title>{{ t('outgoingMessages') }}</watt-expandable-card-title>

          @for (entry of outgoing(); track $index) {
            <watt-expandable-card togglePosition="before" variant="solid">
              <watt-expandable-card-title>{{ entry.type }}</watt-expandable-card-title>
            </watt-expandable-card>
          }
        </watt-expandable-card>
      }

      @if (incoming().length > 0) {
        <watt-expandable-card togglePosition="before" variant="solid">
          <watt-expandable-card-title>{{ t('incomingMessages') }}</watt-expandable-card-title>

          @for (entry of incoming(); track $index) {
            <watt-expandable-card togglePosition="before" variant="solid">
              <watt-expandable-card-title>{{ entry.type }}</watt-expandable-card-title>
            </watt-expandable-card>
          }
        </watt-expandable-card>
      }
    </ng-container>
  `,
})
export class DhDelegationsOverviewComponent {
  outgoing = input<DhDelegationsByType[]>([]);
  incoming = input<DhDelegationsByType[]>([]);

  @Output() setUpDelegation = new EventEmitter<void>();
}
