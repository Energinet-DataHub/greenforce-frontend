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
import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattModalService } from '@energinet-datahub/watt/modal';
import {
  DhActorStorage,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';

import { DhRequestAsModal } from './request-report/request-as-modal.component';
import { DhRequestReportModal } from './request-report/request-report-modal.component';

@Component({
  selector: 'dh-new-report-request',
  imports: [TranslocoPipe, WattButtonComponent],
  template: `
    <watt-button variant="secondary" (click)="openModal()">
      {{ 'reports.measurementReports.requestMeasurementReport' | transloco }}
    </watt-button>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhNewReportRequest {
  private readonly modalService = inject(WattModalService);
  private readonly permissionService = inject(PermissionService);
  private readonly actorStorage = inject(DhActorStorage);

  private isFas = toSignal(this.permissionService.isFas());

  openModal() {
    if (this.isFas()) {
      this.modalService.open({
        component: DhRequestAsModal,
      });
    } else {
      this.modalService.open({
        component: DhRequestReportModal,
        data: {
          isFas: false,
          actorId: this.actorStorage.getSelectedActorId(),
          marketRole: this.actorStorage.getSelectedActor()?.marketRole,
        },
      });
    }
  }
}
