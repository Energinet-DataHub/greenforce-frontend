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
  EoFeatureFlagComponent,
} from '@energinet-datahub/eo/shared/services';
import { LetModule } from '@rx-angular/template';
import { EoConsumptionLineChartComponent } from './eo-consumption-chart-card.component';
import { EoConsumptionPageEnergyConsumptionComponent } from './eo-consumption-page-energy-consumption.component';
import { EoConsumptionPageInfoComponent } from './eo-consumption-page-info.component';
import { EoConsumptionPageTipComponent } from './eo-consumption-page-tip.component';
import { EoConsumptionStore } from './eo-consumption.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    LetModule,
    CommonModule,
    EoStackComponent,
    EoPopupMessageComponent,
    EoFeatureFlagComponent,
    EoDatePickerComponent,
    EoResolutionPickerComponent,
    EoConsumptionPageTipComponent,
    EoConsumptionPageInfoComponent,
    EoConsumptionPageEnergyConsumptionComponent,
    EoConsumptionLineChartComponent,
  ],
  selector: 'eo-consumption-shell',
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
      <eo-stack [size]="'L'">
        <eo-consumption-page-info></eo-consumption-page-info>
        <eo-consumption-line-chart></eo-consumption-line-chart>
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
      <eo-stack [size]="'L'">
        <eo-consumption-page-tip></eo-consumption-page-tip>
        <eo-consumption-page-energy-consumption></eo-consumption-page-energy-consumption>
      </eo-stack>
    </div>
  `,
})
export class EoConsumptionPageShellComponent {
  appSettingsDates$ = this.appSettingsStore.calendarDateRange$;
  error$ = this.consumptionStore.error$;

  constructor(
    private appSettingsStore: AppSettingsStore,
    private consumptionStore: EoConsumptionStore
  ) {}

  setNewAppDates(dates: CalendarDateRange) {
    this.appSettingsStore.setCalendarDateRange(dates);
  }
}
