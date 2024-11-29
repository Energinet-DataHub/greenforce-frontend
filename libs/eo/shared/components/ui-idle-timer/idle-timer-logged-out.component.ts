import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattTypedModal, WATT_MODAL } from '@energinet-datahub/watt/modal';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WattButtonComponent, WATT_MODAL],
  selector: 'eo-idle-timer-modal',
  standalone: true,
  template: `
    <watt-modal #modal title="Automatic logout" size="small">
      <p class="content">For security reasons you have been automatically logged out.</p>

      <watt-modal-actions>
        <watt-button (click)="modal.close(false)">Ok</watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class EoIdleTimerLoggedOutModalComponent extends WattTypedModal {
  close(action?: string) {
    this.dialogRef.close(action);
  }
}
