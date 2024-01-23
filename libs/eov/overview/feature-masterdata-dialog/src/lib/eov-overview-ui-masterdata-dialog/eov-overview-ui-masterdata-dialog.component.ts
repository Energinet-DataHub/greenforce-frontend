import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WATT_DIALOG_DATA, WattModalComponent } from '@energinet-datahub/watt/modal';
import { TranslocoModule } from '@ngneat/transloco';
import { MeteringPointDetails } from '@energinet-datahub/eov/shared/domain';

@Component({
  selector: 'eov-eov-overview-ui-masterdata-dialog',
  standalone: true,
  imports: [
    CommonModule,
    WattModalComponent,
    TranslocoModule
  ],
  templateUrl: './eov-overview-ui-masterdata-dialog.component.html',
  styleUrl: './eov-overview-ui-masterdata-dialog.component.scss',
})
export class EovOverviewUiMasterdataDialogComponent {
  details?: MeteringPointDetails = inject(WATT_DIALOG_DATA).details;
  @ViewChild(WattModalComponent)
  private modal!: WattModalComponent;

  closeModal(): void {
    this.modal.close(false);
  }
}
