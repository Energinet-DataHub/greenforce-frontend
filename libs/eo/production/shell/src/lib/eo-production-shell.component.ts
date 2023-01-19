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
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EoPopupMessageComponent } from '@energinet-datahub/eo/shared/atomic-design/feature-molecules';
import {
  EoDatePickerComponent,
  EoResolutionPickerComponent,
  EoStackComponent,
} from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import {
  AppSettingsStore,
  CalendarDateRange,
  EoFeatureFlagDirective,
} from '@energinet-datahub/eo/shared/services';
import { LetModule } from '@rx-angular/template/let';
import { EoProductionLineChartComponent } from './eo-production-chart-card.component';
import { EoProductionInfoComponent } from './eo-production-info.component';
import { EoProductionTipComponent } from './eo-production-tip.component';
import { EoProductionStore } from './eo-production.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    EoPopupMessageComponent,
    EoFeatureFlagDirective,
    CommonModule,
    LetModule,
    EoDatePickerComponent,
    EoResolutionPickerComponent,
    EoStackComponent,
    EoProductionTipComponent,
    EoProductionInfoComponent,
    EoProductionLineChartComponent,
  ],
  selector: 'eo-production-shell',
  styles: [
    `
      .content {
        display: grid;
        grid-template-columns: 375px 360px; // Magic numbers by designer
        grid-gap: var(--watt-space-l);
      }
    `,
  ],
  template: `
    <ng-container *rxLet="error$ as error">
      <eo-popup-message *ngIf="error" [errorMessage]="error">
      </eo-popup-message>
    </ng-container>
    <div class="content">
      <eo-stack size="L">
        <eo-production-info></eo-production-info>
        <eo-production-line-chart></eo-production-line-chart>
        <eo-date-picker
          [onFeatureFlag]="'daterange'"
          *rxLet="appSettingsDates$ as dates"
          [dateRangeInput]="dates"
          (newDates)="setNewAppDates($event)"
        ></eo-date-picker>
        <eo-resolution-picker
          [onFeatureFlag]="'resolution'"
        ></eo-resolution-picker>
      </eo-stack>
      <eo-stack size="L">
        <eo-production-tip></eo-production-tip>
      </eo-stack>
    </div>
  `,
})
export class EoProductionShellComponent {
  appSettingsDates$ = this.appSettingsStore.calendarDateRange$;
  error$ = this.productionStore.error$;

  constructor(
    private appSettingsStore: AppSettingsStore,
    private productionStore: EoProductionStore
  ) {}

  setNewAppDates(dates: CalendarDateRange) {
    this.appSettingsStore.setCalendarDateRange(dates);
  }
}
