import { Component, input, effect, inject, Injector } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { DhMarketPartyB2BAccessStore } from '@energinet-datahub/dh/market-participant/actors/data-access-api';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { DhRemoveCertificateModalComponent } from './dh-remove-certificate-modal.component';
import { DhCertificateUploaderComponent } from './dh-certificate-uploader.component';
import { DhReplaceCertificateModalComponent } from './dh-replace-certificate-modal.component';
import { DhActorAuditLogService } from '../../dh-actor-audit-log.service';

type DhCertificateTableRow = {
  translationKey: string;
  value?: string;
  valueIsDate?: boolean;
  showActionButton?: boolean;
};

@Component({
  selector: 'dh-certificate-view',
  standalone: true,
  styles: [
    `
      :host {
        display: block;
      }

      h4 {
        margin-top: 0;
      }
    `,
  ],
  templateUrl: './dh-certificate-view.component.html',
  imports: [
    TranslocoDirective,
    TranslocoPipe,

    WattButtonComponent,
    WATT_CARD,
    VaterFlexComponent,
    VaterStackComponent,
    WattDatePipe,
    WATT_TABLE,

    DhEmDashFallbackPipe,
    DhCertificateUploaderComponent,
  ],
})
export class DhCertificateViewComponent {
  private readonly injector = inject(Injector);
  private readonly store = inject(DhMarketPartyB2BAccessStore);
  private readonly toastService = inject(WattToastService);
  private readonly transloco = inject(TranslocoService);
  private readonly modalService = inject(WattModalService);
  private readonly auditLogService = inject(DhActorAuditLogService);

  dataSource = new WattTableDataSource<DhCertificateTableRow>([]);
  columns: WattTableColumnDef<DhCertificateTableRow> = {
    translationKey: { accessor: 'translationKey' },
    value: { accessor: 'value' },
    showActionButton: { accessor: 'showActionButton', align: 'right' },
  };

  actorId = input.required<string>();

  constructor() {
    effect(() => {
      const tableData: DhCertificateTableRow[] = [
        {
          translationKey: 'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.thumbprint',
          value: this.store.certificateMetadata()?.thumbprint,
          showActionButton: true,
        },
        {
          translationKey: 'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.expiryDate',
          value: this.store.certificateMetadata()?.expirationDate.toDateString(),
          valueIsDate: true,
        },
      ];

      this.dataSource.data = tableData;
    });
  }

  removeCertificate(): void {
    this.modalService.open({
      component: DhRemoveCertificateModalComponent,
      onClosed: (result) => {
        if (result) {
          this.store.removeActorCredentials({
            onSuccess: this.onRemoveSuccessFn,
            onError: this.onRemoveErrorFn,
          });
        }
      },
    });
  }

  replaceCertificate(): void {
    this.modalService.open({
      component: DhReplaceCertificateModalComponent,
      injector: this.injector,
      data: { actorId: this.actorId() },
    });
  }

  private readonly onRemoveSuccessFn = () => {
    const message = this.transloco.translate(
      'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.removeSuccess'
    );

    this.toastService.open({ type: 'success', message });

    this.auditLogService.refreshAuditLog(this.actorId());
  };

  private readonly onRemoveErrorFn = () => {
    const message = this.transloco.translate(
      'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.removeError'
    );

    this.toastService.open({ type: 'danger', message });
  };
}
