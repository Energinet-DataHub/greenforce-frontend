import { Component, OnInit } from '@angular/core';
import { WATT_MODAL, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattButtonComponent } from '@energinet/watt/button';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [WATT_MODAL, WattTextFieldComponent, WattButtonComponent, ReactiveFormsModule],
  template: `
    <watt-modal #modal [title]="'Modal works'" closeLabel="Close modal">
      <watt-text-field label="Username" />
      <watt-text-field label="Password" type="password" />
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">Cancel</watt-button>
        <watt-button (click)="modal.close(true)">Save</watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class EoStartReportGenerationModalComponent extends WattTypedModal {

}
