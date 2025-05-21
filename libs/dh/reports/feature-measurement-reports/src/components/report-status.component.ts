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
import { Component, input, output } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { MeasurementsReportStatusType } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

@Component({
  selector: 'dh-report-status',
  template: `<ng-container *transloco="let t; read: 'reports.measurementReports.reportStatus'">
    @switch (status()) {
      @case ('IN_PROGRESS') {
        <watt-badge type="info">{{ t(status()) }}</watt-badge>
      }
      @case ('ERROR') {
        <watt-badge type="warning">{{ t(status()) }}</watt-badge>
      }
      @case ('COMPLETED') {
        <watt-button
          type="button"
          variant="text"
          icon="fileDownload"
          (click)="download.emit($event)"
          >{{ t('download') }}</watt-button
        >
      }
      @case ('CANCELED') {
        <watt-badge type="neutral">{{ t(status()) }}</watt-badge>
      }
    }
  </ng-container>`,
  imports: [WattBadgeComponent, TranslocoDirective, WattButtonComponent],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhReportStatus {
  status = input.required<MeasurementsReportStatusType>();

  download = output<Event>();
}
