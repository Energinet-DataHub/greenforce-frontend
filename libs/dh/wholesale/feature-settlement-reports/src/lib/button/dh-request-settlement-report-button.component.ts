import { Component, DestroyRef, inject } from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattModalService } from '@energinet-datahub/watt/modal';
import {
  DhActorStorage,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';

import { DhRequestSettlementReportModalComponent } from '../modal/dh-request-settlement-report-modal.component';
import { DhRequestAsSettlementReportModalComponent } from '../modal/dh-request-as-settlement-report-modal.component';

@Component({
  selector: 'dh-request-settlement-report-button',
  standalone: true,
  imports: [TranslocoPipe, WattButtonComponent],
  template: `
    <watt-button variant="secondary" (click)="openModal()">
      {{ 'wholesale.settlementReports.requestSettlementReport' | transloco }}
    </watt-button>
  `,
})
export class DhRequestSettlementReportButtonComponent {
  private readonly modalService = inject(WattModalService);
  private readonly permissionService = inject(PermissionService);
  private readonly actorStorage = inject(DhActorStorage);
  private readonly destroyRef = inject(DestroyRef);

  openModal() {
    this.permissionService
      .isFas()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isFas) => {
        if (isFas) {
          this.modalService.open({
            component: DhRequestAsSettlementReportModalComponent,
          });
        } else {
          this.modalService.open({
            component: DhRequestSettlementReportModalComponent,
            data: {
              isFas: false,
              actorId: this.actorStorage.getSelectedActorId(),
              marketRole: this.actorStorage.getSelectedActor()?.marketRole,
            },
          });
        }
      });
  }
}
