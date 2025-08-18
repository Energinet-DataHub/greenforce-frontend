//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion
import { Component, input, effect, inject, Injector } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import { DhMarketPartyB2BAccessStore } from '../dh-b2b-access.store';
import { DhMarketParticipantAuditLogService } from '../../audit-log.service';
import { DhCertificateUploaderComponent } from './dh-certificate-uploader.component';
import { DhRemoveCertificateModalComponent } from './dh-remove-certificate-modal.component';
import { DhReplaceCertificateModalComponent } from './dh-replace-certificate-modal.component';

type DhCertificateTableRow = {
  translationKey: string;
  value?: string;
  valueIsDate?: boolean;
  showActionButton?: boolean;
};

@Component({
  selector: 'dh-certificate-view',
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
  private readonly auditLogService = inject(DhMarketParticipantAuditLogService);

  dataSource = new WattTableDataSource<DhCertificateTableRow>([]);
  columns: WattTableColumnDef<DhCertificateTableRow> = {
    translationKey: { accessor: 'translationKey' },
    value: { accessor: 'value' },
    showActionButton: { accessor: 'showActionButton', align: 'right' },
  };

  marketParticipantId = input.required<string>();

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
      data: { marketParticipantId: this.marketParticipantId() },
    });
  }

  private readonly onRemoveSuccessFn = () => {
    const message = this.transloco.translate(
      'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.removeSuccess'
    );

    this.toastService.open({ type: 'success', message });

    this.auditLogService.refreshAuditLog();
  };

  private readonly onRemoveErrorFn = () => {
    const message = this.transloco.translate(
      'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.removeError'
    );

    this.toastService.open({ type: 'danger', message });
  };
}
