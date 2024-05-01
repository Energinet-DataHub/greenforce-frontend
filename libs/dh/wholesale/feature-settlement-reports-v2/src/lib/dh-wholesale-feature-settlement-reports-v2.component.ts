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
import { Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { VaterStackComponent, VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

@Component({
  selector: 'dh-wholesale-feature-settlement-reports-v2',
  standalone: true,
  imports: [
    TranslocoDirective,

    WATT_CARD,
    VaterStackComponent,
    VaterUtilityDirective,
    WattEmptyStateComponent,
  ],
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    <watt-card vater inset="ml" *transloco="let t; read: 'wholesale.settlementReportsV2'">
      <vater-stack fill="vertical" justify="center">
        <watt-empty-state icon="custom-no-results" [message]="t('emptyMessage')" />
      </vater-stack>
    </watt-card>
  `,
})
export class DhWholesaleFeatureSettlementReportsV2Component {}
