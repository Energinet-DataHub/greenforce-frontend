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
import { AfterViewInit, Component, viewChild, effect } from '@angular/core';
import { DhWholesaleMissingMeasurementsLogRequestLog } from './request-log';
import { DhWholesaleMissingMeasurementsLogTable } from './table';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

/* eslint-disable @angular-eslint/component-class-suffix */
@Component({
  selector: 'dh-wholesale-missing-measurements-log-page',
  imports: [
    DhWholesaleMissingMeasurementsLogRequestLog,
    DhWholesaleMissingMeasurementsLogTable,
    DhPermissionRequiredDirective,
  ],
  template: `
    <!-- TODO: Add right permissions -->
    <dh-wholesale-missing-measurements-log-request-log
      *dhPermissionRequired="[
        'request-aggregated-measured-data:view',
        'request-wholesale-settlement:view',
      ]"
    />
    <dh-wholesale-missing-measurements-log-table (new)="openModal()" />
  `,
})
export class DhWholesaleMissingMeasurementsLogPage {
  modal = viewChild(DhWholesaleMissingMeasurementsLogRequestLog);
  openModal = () => this.modal()?.open();
}
