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

import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { WattTableComponent, WattTableDataSource } from '@energinet-datahub/watt/table';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';

import { EoActivityLogService } from '@energinet-datahub/eo/activity-log/data-access-api';
@Component({
  selector: 'eo-activity-log-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    WattDataTableComponent,
    WattDataFiltersComponent,
    WattDropdownComponent,
    VaterStackComponent,
    WattTableComponent,
    ReactiveFormsModule,
    JsonPipe,
  ],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      eo-activity-log-shell .watt-data-table--empty-state {
        margin-bottom: var(--watt-space-xl);
      }
    `,
  ],
  template: `
    <watt-data-table vater inset="m">
      <h3>Results</h3>
      <watt-data-filters>
        <vater-stack fill="vertical" gap="s" direction="row">
          <watt-dropdown
            label="Filter by"
            [options]="eventTypes"
            [chipMode]="true"
            [formControl]="eventTypesControl"
            [multiple]="true"
            placeholder="Event type"
          />
        </vater-stack>
      </watt-data-filters>

      <watt-table [dataSource]="dataSource" />
    </watt-data-table>
  `,
})
export class EoActivityLogShellComponent implements OnInit {
  protected dataSource: WattTableDataSource<unknown> = new WattTableDataSource(undefined);
  protected eventTypes: WattDropdownOption[] = [
    { value: 'transfer-agreement', displayValue: 'Transfer agreement' },
    { value: 'metering-points', displayValue: 'Metering point' },
  ];
  protected eventTypesControl = new FormControl(this.eventTypes.map((option) => option.value));

  private activityLogService = inject(EoActivityLogService);

  ngOnInit(): void {
      this.activityLogService.getLogs({ start: '2021-01-01', end: '2021-12-31', entityType: 'TransferAgreement'});
  }
}
