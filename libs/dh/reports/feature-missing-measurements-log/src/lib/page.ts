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
import { Component, inject, viewChild } from '@angular/core';
import { DhReportsMissingMeasurementsLogRequestLog } from './request-log';
import { DhReportsMissingMeasurementsLogTable } from './table';
import { RouterOutlet } from '@angular/router';
import { injectRelativeNavigate } from '@energinet-datahub/dh/wholesale/shared';
import { DhRequestMissingMeasurementLogService } from './request-log-service';
import { MutationStatus } from '@energinet-datahub/dh/shared/util-apollo';

/* eslint-disable @angular-eslint/component-class-suffix */
@Component({
  selector: 'dh-reports-missing-measurements-log-page',
  imports: [DhReportsMissingMeasurementsLogTable, RouterOutlet],
  providers: [DhRequestMissingMeasurementLogService],
  template: `
    <router-outlet />
    <dh-reports-missing-measurements-log-table (new)="navigate('request')" [created]="request.status() === resolved" />
  `,
})
export class DhReportsMissingMeasurementsLogPage {
  modal = viewChild(DhReportsMissingMeasurementsLogRequestLog);
  navigate = injectRelativeNavigate();
  request = inject(DhRequestMissingMeasurementLogService).request;
  resolved = MutationStatus.Resolved;
}
