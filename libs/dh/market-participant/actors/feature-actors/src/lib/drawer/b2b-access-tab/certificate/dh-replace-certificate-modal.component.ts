import { Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattTypedModal, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { DhGenerateClientSecretComponent } from '../client-secret/dh-generate-client-secret.component';

@Component({
  selector: 'dh-replace-certificate-modal',
  standalone: true,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `
    <watt-modal
      #modal
      *transloco="
        let t;
        read: 'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.certificate.replaceCertificateModal'
      "
      [title]="t('title')"
    >
      <p>{{ t('message') }}</p>

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">
          {{ t('cancel') }}
        </watt-button>

        <dh-generate-client-secret
          [actorId]="modalData.actorId"
          (generateSuccess)="modal.close(true)"
        />
      </watt-modal-actions>
    </watt-modal>
  `,
  imports: [TranslocoDirective, WATT_MODAL, WattButtonComponent, DhGenerateClientSecretComponent],
})
export class DhReplaceCertificateModalComponent extends WattTypedModal<{
  actorId: string;
}> {}
