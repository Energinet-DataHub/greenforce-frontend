import { Component } from '@angular/core';
import { WATT_MODAL, WattTypedModal } from '@energinet-datahub/watt/modal';
import { TranslocoDirective } from '@ngneat/transloco';
import { DhDelegation } from '../dh-delegations';

@Component({
  standalone: true,
  selector: 'dh-delegation-stop-modal',
  styles: `
    :host {
      display: block;
    }
  `,
  imports: [WATT_MODAL, TranslocoDirective],
  template: `<watt-modal
    [title]="t('stopModalTitle')"
    *transloco="let t; read: 'marketParticipant.delegation'"
  >
    <watt-modal-actions> </watt-modal-actions>
    ></watt-modal
  >`,
})
export class DhDelegationStopModalComponent extends WattTypedModal<DhDelegation[]> {}
