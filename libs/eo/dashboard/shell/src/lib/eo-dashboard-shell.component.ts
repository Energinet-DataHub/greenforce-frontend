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
import { EoInlineMessageComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { WattIconModule } from '@energinet-datahub/watt/icon';
import { EoDashboardChartCardComponent } from './eo-dashboard-chart-card.component';
import { EoDashboardEmissionsCardComponent } from './eo-dashboard-emissions-card.component';
import { EoDashboardGetDataComponent } from './eo-dashboard-get-data.component';
import { EoDashboardHourlyDeclarationComponent } from './eo-dashboard-hourly-declaration.component';
import { EoDashboardLinksComponent } from './eo-dashboard-links.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    WattIconModule,
    EoInlineMessageComponent,
    EoDashboardLinksComponent,
    EoDashboardGetDataComponent,
    EoDashboardHourlyDeclarationComponent,
    EoDashboardChartCardComponent,
    EoDashboardEmissionsCardComponent,
  ],
  selector: 'eo-dashboard-shell',
  styles: [
    `
      :host {
        display: block;
      }

      .shell-container {
        display: grid;
        grid-template-columns: 375px 375px;
        gap: var(--watt-space-l);
      }
    `,
  ],
  template: `
    <div class="shell-container">
      <div>
        <eo-dashboard-chart-card class="watt-space-stack-l"></eo-dashboard-chart-card>
        <eo-dashboard-links class="watt-space-stack-l"></eo-dashboard-links>
      </div>
      <div>
        <eo-dashboard-emissions-card class="watt-space-stack-l"></eo-dashboard-emissions-card>
        <eo-dashboard-hourly-declaration
          class="watt-space-stack-l"
        ></eo-dashboard-hourly-declaration>
        <eo-dashboard-get-data></eo-dashboard-get-data>
      </div>
    </div>
    <eo-inline-message type="warning">
      <watt-icon name="custom-primary-info" size="l"></watt-icon>
      <p>
        The Energy Origin Platform is <strong>under development</strong> and new functionalities
        will be released continuously. The first release of the platform only offers
        <strong>data for companies</strong>. Data for private users is intended to form part of one
        of the next releases. If you want to influence the new functionality, join us at our
        <a
          href="https://www.linkedin.com/groups/12643238/"
          target="_blank"
          rel="noopener noreferrer"
          >LinkedIn group</a
        >.
      </p>
    </eo-inline-message>
  `,
})
export class EoDashboardShellComponent {}
