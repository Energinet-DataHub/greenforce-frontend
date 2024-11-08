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
import { Component, output } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

@Component({
  standalone: true,
  selector: 'dh-settlement-reports-cancel-button',
  template: `<ng-container *transloco="let t; read: 'wholesale.settlementReports.reportStatus'">
    <watt-button type="button" variant="text" icon="close" (click)="cancel.emit($event)">{{
      t('cancel')
    }}</watt-button>
  </ng-container>`,
  imports: [WattBadgeComponent, TranslocoDirective, WattButtonComponent],
})
export class DhSettlementReportsCancelButtonComponent {
  cancel = output<Event>();
}
