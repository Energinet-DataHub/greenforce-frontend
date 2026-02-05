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
import { Component, effect, inject, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WattModalService } from '@energinet/watt/modal';

import { injectToast } from '@energinet-datahub/dh/shared/ui-util';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import {
  CancelSettlementReportDocument,
  GetSettlementReportsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhCancelReportRequestModal } from '../request-report/cancel-report-request-modal.component';

@Component({
  selector: 'dh-cancel-report-request',
  template: `
    <ng-container *transloco="let t; prefix: 'reports.settlementReports.cancelReport'">
      <watt-button size="small" variant="text" icon="close" (click)="openCancelModal($event)">
        {{ t('baseName') }}
      </watt-button>
    </ng-container>
  `,
  imports: [TranslocoDirective, WattButtonComponent],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhCancelReportRequest {
  private readonly modalService = inject(WattModalService);

  readonly reportId = input<string>();

  cancelSettlementReport = mutation(CancelSettlementReportDocument);
  toast = injectToast('reports.settlementReports.cancelReport');
  toastEffect = effect(() => this.toast(this.cancelSettlementReport.status()));

  openCancelModal(event: Event) {
    // Stop the row click event from propagating
    // so the drawer doesn't open
    event.stopPropagation();

    this.modalService.open({
      component: DhCancelReportRequestModal,
      onClosed: (isSuccess) => {
        const id = this.reportId();
        if (id && isSuccess) {
          this.cancelSettlementReport.mutate({
            // refetchQueries: [{ query: GetSettlementReportsDocument }],
            refetchQueries: [GetSettlementReportsDocument],
            variables: { input: { id } },
          });
        }
      },
    });
  }
}
