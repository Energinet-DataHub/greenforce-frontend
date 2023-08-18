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

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    WattCheckboxComponent,
    EoCertificatesTableComponent,
    WattButtonComponent,
    WattCardComponent,
  ],
  selector: 'eo-certificates',
  standalone: true,
  styles: [],
  template: `
    <watt-card class="watt-space-stack-l">
      <h3 class="watt-space-stack-m">Welcome to the beta test of Energy Origin</h3>
      <h4 class="watt-space-stack-m">Notice of change:</h4>
      <p class="watt-space-stack-m">
        Due to changes in the solution regarding certificates, some data has been removed or is
        planned to be removed. <br />
        This means that metering points that have been activated for issuance of certificates before
        August 17th, 2023, must be re-activated. Furthermore, certificates that have been issued
        before August 23rd, 2023, will be removed. <br />
        <br />
        This page is based on real data and is working towards the coming solution regarding
        certificates. So it is not just a test, though these data cannot yet be used in a legal
        sense. It will be communicated, when it is out of beta and can be used legally. So you can
        try this without any consequences.
      </p>
    </watt-card>
    <mat-card class="watt-space-stack-m">
      <eo-certificates-table></eo-certificates-table>
    </mat-card>
  `,
})
export class EoCertificatesComponent {}
