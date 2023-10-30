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
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { EoCertificatesTableComponent } from '@energinet-datahub/eo/certificates/feature-overview';

import { EoBetaMessageComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WattCheckboxComponent,
    EoCertificatesTableComponent,
    WattButtonComponent,
    EoBetaMessageComponent,
    WATT_CARD,
  ],
  selector: 'eo-certificates',
  standalone: true,
  styles: [],
  template: `
    <eo-eo-beta-message></eo-eo-beta-message>
    <watt-card class="watt-space-stack-m">
      <eo-certificates-table></eo-certificates-table>
    </watt-card>
  `,
})
export class EoCertificatesComponent {}
