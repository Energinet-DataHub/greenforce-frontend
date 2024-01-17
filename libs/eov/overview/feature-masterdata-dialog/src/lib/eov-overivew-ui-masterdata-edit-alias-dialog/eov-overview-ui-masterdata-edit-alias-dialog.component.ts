import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WattModalActionsComponent, WattModalComponent } from '@energinet-datahub/watt/modal';
import { TranslocoModule } from '@ngneat/transloco';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

@Component({
  selector: 'eov-eov-overview-ui-masterdata-dialog',
  standalone: true,
  imports: [
    CommonModule,
    WattModalComponent,
    WattModalActionsComponent,
    WattButtonComponent,
    TranslocoModule
  ],
  templateUrl: './eov-overview-ui-masterdata-edit-alias-dialog.component.html',
  styleUrl: './eov-overview-ui-masterdata-edit-alias-dialog.component.css',
})
export class EovOverviewUiMasterdataAliasEditDialogComponent {
  @ViewChild(WattModalComponent)
  private modal!: WattModalComponent;

  @Output() closed = new EventEmitter<{ saveSuccess: boolean }>();

  closeModal(saveSuccess: boolean): void {
    this.modal.close(saveSuccess);
    this.closed.emit({ saveSuccess });
  }
}
