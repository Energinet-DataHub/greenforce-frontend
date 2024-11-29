import { Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattTypedModal, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { DhCertificateUploaderComponent } from '../certificate/dh-certificate-uploader.component';

@Component({
  selector: 'dh-replace-client-secret-modal',
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
        read: 'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.clientSecret.replaceSecretModal'
      "
      [title]="t('title')"
    >
      <p>{{ t('message') }}</p>

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">
          {{ t('cancel') }}
        </watt-button>

        <dh-certificate-uploader
          [actorId]="modalData.actorId"
          (uploadSuccess)="modal.close(true)"
        />
      </watt-modal-actions>
    </watt-modal>
  `,
  imports: [TranslocoDirective, WATT_MODAL, WattButtonComponent, DhCertificateUploaderComponent],
})
export class DhReplaceClientSecretModalComponent extends WattTypedModal<{
  actorId: string;
}> {}
