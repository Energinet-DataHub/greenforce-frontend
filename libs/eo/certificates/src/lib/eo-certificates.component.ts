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
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { EoCertificatesTableComponent } from './eo-certificates-table.component';
import { WattCardComponent } from '@energinet-datahub/watt/card';
import { EoBetaMessageComponent } from '../../../shared/atomic-design/ui-atoms/src/lib/eo-beta-message/eo-beta-message.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    WattCheckboxComponent,
    EoCertificatesTableComponent,
    WattButtonComponent,
    WattCardComponent,
    EoBetaMessageComponent,
  ],
  selector: 'eo-certificates',
  standalone: true,
  styles: [],
  template: `
    <eo-eo-beta-message></eo-eo-beta-message>
    <mat-card class="watt-space-stack-m">
      <eo-certificates-table></eo-certificates-table>
    </mat-card>
  `,
})
export class EoCertificatesComponent {}
