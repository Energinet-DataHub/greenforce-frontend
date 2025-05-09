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
import { Component, DestroyRef, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
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
  selector: 'dh-request-settlement-report',
  imports: [TranslocoPipe, WattButtonComponent],
  template: `
    <watt-button variant="secondary" (click)="openModal()">
      {{ 'reports.settlementReports.requestSettlementReport' | transloco }}
    </watt-button>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class RequestSettlementReport {
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
