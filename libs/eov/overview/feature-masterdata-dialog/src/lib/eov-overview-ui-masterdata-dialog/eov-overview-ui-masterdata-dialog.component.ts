import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WattModalComponent } from '@energinet-datahub/watt/modal';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'eov-eov-overview-ui-masterdata-dialog',
  standalone: true,
  imports: [
    CommonModule,
    WattModalComponent,
    TranslocoModule
  ],
  templateUrl: './eov-overview-ui-masterdata-dialog.component.html',
  styleUrl: './eov-overview-ui-masterdata-dialog.component.css',
})
export class EovOverviewUiMasterdataDialogComponent {
  details;
}
