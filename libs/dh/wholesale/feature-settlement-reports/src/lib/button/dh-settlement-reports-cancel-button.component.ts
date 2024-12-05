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
import { Component, DestroyRef, inject, input } from '@angular/core';
import { translate, TranslocoDirective } from '@ngneat/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { DhSettlementReportsCancelModalComponent } from '../modal/dh-settlement-reports-cancel-modal.component';
import { Apollo } from 'apollo-angular';
import {
  CancelSettlementReportDocument,
  GetSettlementReportsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WattToastService } from '@energinet-datahub/watt/toast';

@Component({
  standalone: true,
  selector: 'dh-settlement-reports-cancel-button',
  template: `<ng-container *transloco="let t; read: 'wholesale.settlementReports.cancelReport'">
    <watt-button type="button" variant="text" icon="close" (click)="openCancelModal($event)">{{
      t('baseName')
    }}</watt-button>
  </ng-container>`,
  imports: [TranslocoDirective, WattButtonComponent],
})
export class DhSettlementReportsCancelButtonComponent {
  reportId = input<string>();

  private readonly toastService = inject(WattToastService);
  private readonly modalService = inject(WattModalService);
  private readonly apollo = inject(Apollo);
  private readonly destroyRef = inject(DestroyRef);

  openCancelModal(event: Event) {
    // Stop the row click event from propagating
    // so the drawer doesn't open
    event.stopPropagation();

    this.modalService.open({
      component: DhSettlementReportsCancelModalComponent,
      onClosed: (isSuccess) => {
        const id = this.reportId();
        if (isSuccess && id) {
          this.apollo
            .mutate({
              mutation: CancelSettlementReportDocument,
              variables: {
                input: {
                  requestId: { id },
                },
              },
              refetchQueries: [GetSettlementReportsDocument],
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.showSuccessNotification();
              },
              error: () => {
                this.showErrorNotification();
              },
            });
        }
      },
    });
  }

  private showSuccessNotification(): void {
    this.toastService.open({
      message: translate('wholesale.settlementReports.cancelReport.requestSuccess'),
      type: 'success',
    });
  }

  private showErrorNotification(): void {
    this.toastService.open({
      message: translate('wholesale.settlementReports.cancelReport.requestError'),
      type: 'danger',
    });
  }
}
