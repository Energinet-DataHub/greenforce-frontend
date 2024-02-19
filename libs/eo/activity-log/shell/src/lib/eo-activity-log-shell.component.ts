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
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { Form, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { endOfToday, getUnixTime, startOfToday, subDays } from 'date-fns';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';

import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import {
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
} from '@energinet-datahub/watt/table';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattDateRangeChipComponent } from '@energinet-datahub/watt/datepicker';
import { WattFormChipDirective } from '@energinet-datahub/watt/field';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { translations } from '@energinet-datahub/eo/translations';

import {
  ActivityLogEntryResponse,
  EoActivityLogService,
  activityLogActionType,
  activityLogEntityType,
} from '@energinet-datahub/eo/activity-log/data-access-api';

interface ActivityLogForm {
  period: FormControl<{ start: number; end: number }>;
  eventTypes: FormControl<activityLogEntityType[]>;
}

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
    TranslocoPipe,
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
    @if (columns) {
      <watt-data-table vater inset="m" [error]="state().hasError">
        <h3>{{ translations.activityLog.tableTitle | transloco }}</h3>
        <watt-data-filters>
          <form [formGroup]="form">
            <vater-stack fill="vertical" gap="s" direction="row">
              <watt-dropdown
                [options]="eventTypes"
                [chipMode]="true"
                formControlName="eventTypes"
                [multiple]="true"
                [placeholder]="translations.activityLog.eventTypeLabel | transloco"
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
    }
  `,
})
export class EoActivityLogShellComponent implements OnInit {
  private transloco = inject(TranslocoService);
  private cd = inject(ChangeDetectorRef);

  protected translations = translations;
  protected dataSource: WattTableDataSource<{ timestamp: string; event: string }> =
    new WattTableDataSource(undefined);
  protected columns!: WattTableColumnDef<{ timestamp: string; event: string }>;

  protected eventTypes!: WattDropdownOption[];

  protected form!: FormGroup<ActivityLogForm>;
  protected state = signal<{ hasError: boolean; isLoading: boolean }>({
    hasError: false,
    isLoading: false,
  });

  private destroyRef = inject(DestroyRef);
  private activityLogService = inject(EoActivityLogService);
  private datePipe: WattDatePipe = inject(WattDatePipe);

  ngOnInit(): void {
    this.transloco.selectTranslation().subscribe(() => {
      this.setEventTypes();
      this.setColumns();
      this.getLogs();
      this.sortData();

      this.form.valueChanges
        .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          const { period } = this.form.getRawValue();
          if (period?.start && period?.end) {
            this.getLogs();
          }
        });

      this.cd.detectChanges();
    });
  }

  private setEventTypes(): void {
    this.eventTypes = [
      {
        value: 'TransferAgreement',
        displayValue: this.transloco.translate(
          this.translations.activityLog.transferAgreementEventType
        ),
      },
      {
        value: 'MeteringPoint',
        displayValue: this.transloco.translate(
          this.translations.activityLog.meteringPointEventType
        ),
      },
    ];

    this.initForm();
  }

  private initForm() {
    this.form = new FormGroup({
      period: new FormControl(this.last30Days(), { nonNullable: true }),
      eventTypes: new FormControl<activityLogEntityType[]>(
        this.eventTypes.map((option) => option.value as activityLogEntityType),
        { nonNullable: true }
      ),
    });
  }

  private setColumns(): void {
    this.columns = {
      timestamp: {
        accessor: (x) => x.timestamp,
        header: this.transloco.translate(this.translations.activityLog.timeTableHeader),
      },
      event: {
        accessor: (x) => x.event,
        header: this.transloco.translate(this.translations.activityLog.eventTableHeader),
      },
    };
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
        event: `${this.formatActorType(x)} has ${this.formatActionType(
          x.actionType
        )} ${this.formatEntityType(x.entityType)} with ID ${x.entityId}`,
      };
    });
  }

  private sortData() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.dataSource.sortData = (data: any[], sort: any) => {
      const isAsc = sort.direction === 'asc';

      if (!sort.active || sort.direction === '') {
        return data;
      } else if (sort.active === 'timestamp') {
        return data.sort((a, b) => {
          return this.compare(
            new Date(a.timestamp).getTime(),
            new Date(b.timestamp).getTime(),
            isAsc
          );
        });
      } else {
        return data.sort((a, b) => {
          return this.compare(a[sort.active], b[sort.active], isAsc);
        });
      }
    };
  }

  private compare(a: number, b: number, isAsc: boolean): number {
    if (a < b) {
      return isAsc ? -1 : 1;
    } else if (a > b) {
      return isAsc ? 1 : -1;
    } else {
      return 0;
    }
  }

  private last30Days(): { start: number; end: number } {
    return {
      start: getUnixTime(subDays(startOfToday(), 30)) * 1000, // 30 days ago at 00:00
      end: getUnixTime(endOfToday()) * 1000, // Today at 23:59:59
    };
  }

  private formatActorType(logEntry: ActivityLogEntryResponse): string {
    if (logEntry.actorType === 'System') {
      return 'System';
    } else {
      return `${logEntry.organizationName} (${logEntry.organizationTin})`;
    }
  }

  private formatActionType(actionType: activityLogActionType): string {
    if (actionType === 'Created') {
      return 'created a';
    } else if (actionType === 'Accepted') {
      return 'accepted the';
    } else if (actionType === 'Declined') {
      return 'declined the';
    } else if (actionType === 'Activated') {
      return 'activated the';
    } else if (actionType === 'Deactivated') {
      return 'deactivated the';
    } else if (actionType === 'EndDateChanged') {
      return 'deactivated or changed the end date of the';
    } else if (actionType === 'Expired') {
      return 'expired the';
    } else {
      return actionType;
    }
  }

  private formatEntityType(entityType: activityLogEntityType): string {
    switch (entityType) {
      case 'MeteringPoint':
        return 'metering point';
      case 'TransferAgreementProposal':
        return 'proposal of a transfer agreement';
      case 'TransferAgreement':
        return 'transfer agreement';
    }
  }
}
