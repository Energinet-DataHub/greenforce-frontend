import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';

import { WATT_MODAL, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

@Component({
  selector: 'dh-settlement-reports-cancel-modal',
  standalone: true,
  imports: [ReactiveFormsModule, TranslocoDirective, WATT_MODAL, WattButtonComponent],
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <watt-modal
      *transloco="let t; read: 'wholesale.settlementReports.cancelReport'"
      [title]="t('title')"
      #modal
    >
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">
          {{ t('cancel') }}
        </watt-button>

        <watt-button variant="primary" (click)="modal.close(true)">
          {{ t('confirm') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhSettlementReportsCancelModalComponent extends WattTypedModal {}
