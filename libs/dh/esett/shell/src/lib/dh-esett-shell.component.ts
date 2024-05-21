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

import { WATT_LINK_TABS } from '@energinet-datahub/watt/tabs';
import { ESettSubPaths, combinePaths } from '@energinet-datahub/dh/core/routing';

@Component({
  selector: 'dh-esett-shell',
  standalone: true,
  template: `
    <watt-link-tabs *transloco="let t; read: 'eSett.tabs'">
      <watt-link-tab
        [label]="t('outgoingMessages.tabLabel')"
        [link]="getLink('outgoing-messages')"
      />
      <watt-link-tab
        [label]="t('meteringGridareaImbalance.tabLabel')"
        [link]="getLink('metering-gridarea-imbalance')"
      />
      <watt-link-tab
        [label]="t('balanceResponsible.tabLabel')"
        [link]="getLink('balance-responsible')"
      />
      ></watt-link-tabs
    >
  `,
  imports: [TranslocoDirective, WATT_LINK_TABS],
})
export class DhESettShellComponent {
  getLink = (path: ESettSubPaths) => combinePaths('esett', path);
}
