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

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import {
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
} from '@energinet-datahub/watt/table';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';

import {
  ActivityLogEntryResponse,
  EoActivityLogService,
  activityLogActionType,
  activityLogActorType,
  activityLogEntityType,
} from '@energinet-datahub/eo/activity-log/data-access-api';
import { WattDateRangeChipComponent } from '@energinet-datahub/watt/datepicker';
import { endOfToday, getUnixTime, startOfToday, subDays } from 'date-fns';
import { WattFormChipDirective } from '@energinet-datahub/watt/field';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'eo-activity-log-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    WattDataTableComponent,
    WattDataFiltersComponent,
    WattDropdownComponent,
    VaterStackComponent,
    WattDateRangeChipComponent,
    WattTableComponent,
    ReactiveFormsModule,
    WattFormChipDirective,
  ],
  providers: [WattDatePipe],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      eo-activity-log-shell .watt-data-table--empty-state {
        margin-bottom: var(--watt-space-xl);
      }
    `,
  ],
  template: `
    <watt-data-table vater inset="m" [error]="state().hasError">
      <h3>Results</h3>
      <watt-data-filters>
        <form [formGroup]="form">
          <vater-stack fill="vertical" gap="s" direction="row">
            <watt-dropdown
              label="Filter by"
              [options]="eventTypes"
              [chipMode]="true"
              formControlName="eventTypes"
              [multiple]="true"
              placeholder="Event type"
            />
            <watt-date-range-chip [formControl]="form.controls.period" [placeholder]="false" />
          </vater-stack>
        </form>
      </watt-data-filters>

      <watt-table
        [dataSource]="dataSource"
        [columns]="columns"
        sortBy="timestamp"
        sortDirection="desc"
        [loading]="state().isLoading"
      />
    </watt-data-table>
  `,
})
export class EoActivityLogShellComponent implements OnInit {
  protected dataSource: WattTableDataSource<{ timestamp: string; event: string }> =
    new WattTableDataSource(undefined);
  protected columns: WattTableColumnDef<{ timestamp: string; event: string }> = {
    timestamp: { accessor: (x) => x.timestamp },
    event: { accessor: (x) => x.event },
  };

  protected eventTypes: WattDropdownOption[] = [
    { value: 'TransferAgreement', displayValue: 'Transfer agreement' },
    { value: 'MeteringPoint', displayValue: 'Metering point' },
  ];
  protected form = new FormGroup({
    period: new FormControl(this.last30Days(), { nonNullable: true }),
    eventTypes: new FormControl<activityLogEntityType[]>(
      this.eventTypes.map((option) => option.value as activityLogEntityType),
      { nonNullable: true }
    ),
  });
  protected state = signal<{ hasError: boolean; isLoading: boolean }>({
    hasError: false,
    isLoading: false,
  });

  private destroyRef = inject(DestroyRef);
  private activityLogService = inject(EoActivityLogService);
  private datePipe: WattDatePipe = inject(WattDatePipe);

  ngOnInit(): void {
    this.getLogs();

    this.form.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.getLogs();
      });
  }

  private getLogs() {
    this.state.set({ ...this.state(), isLoading: true });
    this.setDataSource([]);
    this.activityLogService.getLogs(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.state.set({
          hasError: false,
          isLoading: false,
        });
        this.setDataSource(response);
      },
      error: () => {
        this.state.set({
          hasError: true,
          isLoading: false,
        });
      },
    });
  }

  private setDataSource(data: ActivityLogEntryResponse[]) {
    this.dataSource.data = data.map((x) => {
      return {
        timestamp: this.datePipe.transform(x.timestamp, 'longAbbrWithSeconds') as string,
        event: `${this.formatActorType(x)} has ${this.formatActionType(x.actionType)} ${this.formatEntityType(x.entityType)} with ID ${x.entityId}`,
      };
    });
  }

  private last30Days(): { start: number; end: number } {
    return {
      start: getUnixTime(subDays(startOfToday(), 30)) * 1000, // 30 days ago at 00:00
      end: getUnixTime(endOfToday()) * 1000, // Today at 23:59:59
    };
  }

  private formatActorType(logEntry: ActivityLogEntryResponse): string {
    if(logEntry.actorType === 'System') {
      return 'System';
    } else {
      return `${logEntry.organizationName} (${logEntry.organizationTin})`;
    }
  }

  private formatActionType(actionType: activityLogActionType): string {
    if(actionType === 'Created') {
      return 'created a';
    }
    else if(actionType === 'Accepted') {
      return 'accepted the';
    }
    else if(actionType === 'Declined') {
      return 'declined the';
    }
    else if(actionType === 'Activated') {
      return 'activated the';
    }
    else if(actionType === 'Deactivated') {
      return 'deactivated the';
    }
    else if(actionType === 'EndDateChanged') {
      return 'deactivated or changed the end date of the';
    }
    else if(actionType === 'Expired') {
      return 'expired the';
    }
    else {
      return actionType;
    }
  }

  private formatEntityType(entityType: activityLogEntityType): string {
    switch(entityType) {
      case "MeteringPoint":
        return 'metering point';
      case "TransferAgreementProposal":
        return 'proposal of a transfer agreement';
      case "TransferAgreement":
        return 'transfer agreement';
    }
  }
}
