//#region License
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
//#endregion
import { ChangeDetectionStrategy, Component, computed, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { TranslocoDirective, TranslocoService, translate } from '@jsverse/transloco';

import { WattBadgeComponent } from '@energinet/watt/badge';
import { WattDateRangeChipComponent, WattFormChipDirective } from '@energinet/watt/chip';
import {
  WattDataFiltersComponent,
  WattDataIntlService,
  WattDataTableComponent,
} from '@energinet/watt/data';
import { WattDatePipe } from '@energinet/watt/date';
import type { WattRange } from '@energinet/watt/date';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import type { WattDropdownOptions } from '@energinet/watt/dropdown';
import { dataSource, WATT_TABLE, WattTableColumnDef } from '@energinet/watt/table';
import { VaterStackComponent, VaterUtilityDirective } from '@energinet/watt/vater';

import { FailedProcessSuspendReason } from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  DhResetFiltersButtonComponent,
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { DhNavigationService } from '@energinet-datahub/dh/shared/util-navigation';

import {
  dhFailedProcessOwnerLabel,
  dhFailedProcessTypeLabel,
  dhSuspendReasonBadgeType,
} from '../labels';
import { FailedProcess } from '../types';
import { DhFailedProcessesStore } from './failed-processes.store';

@Injectable()
class DhFailedProcessesIntlService extends WattDataIntlService {
  private readonly transloco = inject(TranslocoService);

  constructor() {
    super();
    this.transloco
      .selectTranslateObject('failedProcesses.emptyState')
      .pipe(takeUntilDestroyed())
      .subscribe((t) => {
        this.emptyTitle = t.title;
        this.emptyText = t.message;
        this.changes.next();
      });
  }
}

@Component({
  selector: 'dh-failed-processes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterOutlet,
    TranslocoDirective,
    VaterStackComponent,
    VaterUtilityDirective,
    WATT_TABLE,
    WattBadgeComponent,
    WattDataFiltersComponent,
    WattDataTableComponent,
    WattDatePipe,
    WattDateRangeChipComponent,
    WattDropdownComponent,
    WattFormChipDirective,
    DhDropdownTranslatorDirective,
    DhResetFiltersButtonComponent,
  ],
  providers: [
    DhNavigationService,
    { provide: WattDataIntlService, useClass: DhFailedProcessesIntlService },
  ],
  template: `
    <watt-data-table
      *transloco="let t; prefix: 'failedProcesses'"
      vater
      inset="ml"
      [error]="store.error()"
      [ready]="store.called() && !store.loading()"
      [enableSearch]="false"
      [pageSize]="100"
    >
      <watt-data-filters>
        <form
          vater-stack
          scrollable
          direction="row"
          gap="s"
          tabindex="-1"
          [formGroup]="form"
          *transloco="let t; prefix: 'failedProcesses.filters'"
        >
          <watt-date-range-chip [formControl]="form.controls.period">
            {{ t('period') }}
          </watt-date-range-chip>
          <watt-dropdown
            [formControl]="form.controls.suspendReasons"
            [chipMode]="true"
            [multiple]="true"
            [options]="statusOptions"
            [placeholder]="t('status')"
            dhDropdownTranslator
            translateKey="failedProcesses.suspendReason"
          />
          <watt-dropdown
            [formControl]="form.controls.processTypes"
            [chipMode]="true"
            [multiple]="true"
            [options]="typeOptions()"
            [placeholder]="t('brs')"
          />
          <watt-dropdown
            [formControl]="form.controls.owners"
            [chipMode]="true"
            [multiple]="true"
            [options]="ownerOptions()"
            [placeholder]="t('owner')"
          />
          @if (hasActiveFilters()) {
            <dh-reset-filters-button />
          }
        </form>
      </watt-data-filters>
      <watt-table
        variant="zebra"
        sortBy="registered"
        sortDirection="desc"
        *transloco="let resolveHeader; prefix: 'failedProcesses.columns'"
        [dataSource]="dataSource"
        [columns]="columns"
        [loading]="store.loading()"
        [resolveHeader]="resolveHeader"
        [activeRow]="selection()"
        (rowClick)="navigation.navigate('details', $event.id)"
      >
        <ng-container *wattTableCell="columns.brs; let process">
          {{ typeLabel(process.processType) }}
        </ng-container>
        <ng-container *wattTableCell="columns.owner; let process">
          {{ ownerLabel(process.createdBy) }}
        </ng-container>
        <ng-container *wattTableCell="columns.status; let process">
          <watt-badge [type]="badgeType(process.suspendReason)">
            {{ t('suspendReason.' + process.suspendReason) }}
          </watt-badge>
        </ng-container>
        <ng-container *wattTableCell="columns.registered; let process">
          {{ process.createdAt | wattDate: 'long' }}
        </ng-container>
      </watt-table>
    </watt-data-table>
    <router-outlet />
  `,
})
export class DhFailedProcesses {
  protected readonly navigation = inject(DhNavigationService);
  protected readonly store = inject(DhFailedProcessesStore);

  protected readonly typeLabel = dhFailedProcessTypeLabel;
  protected readonly ownerLabel = dhFailedProcessOwnerLabel;
  protected readonly badgeType = dhSuspendReasonBadgeType;

  dataSource = dataSource(() => this.store.filteredProcesses());

  columns: WattTableColumnDef<FailedProcess> = {
    brs: { accessor: (process) => dhFailedProcessTypeLabel(process.processType) },
    meteringPointId: { accessor: 'meteringPointId' },
    owner: { accessor: (process) => dhFailedProcessOwnerLabel(process.createdBy) },
    status: {
      accessor: (process) => translate(`failedProcesses.suspendReason.${process.suspendReason}`),
    },
    registered: { accessor: 'createdAt' },
  };

  statusOptions = dhEnumToWattDropdownOptions(FailedProcessSuspendReason);

  // Dropdown options are derived from the LOADED processes so the list stays relevant.
  // Labels reuse the shared process-type table with a raw-key fallback, so unknown
  // composite keys still surface as selectable options.
  typeOptions = computed<WattDropdownOptions>(() => {
    const values = [
      ...new Set(
        this.store
          .processes()
          .map((p) => p.processType)
          .filter((v): v is string => v != null)
      ),
    ];
    return values.map((value) => ({ value, displayValue: dhFailedProcessTypeLabel(value) }));
  });

  ownerOptions = computed<WattDropdownOptions>(() => {
    const owners = new Map<string, string>();
    for (const process of this.store.processes()) {
      if (process.createdBy) {
        owners.set(process.createdBy.id, dhFailedProcessOwnerLabel(process.createdBy));
      }
    }
    return [...owners].map(([value, displayValue]) => ({ value, displayValue }));
  });

  form = new FormGroup({
    period: dhMakeFormControl<WattRange<Date>>(null),
    suspendReasons: dhMakeFormControl<FailedProcessSuspendReason[]>(null),
    // Holds `processType` composite keys (e.g. BRS_002_EndOfSupply).
    processTypes: dhMakeFormControl<string[]>(null),
    // Holds `createdBy` MarketParticipant ids.
    owners: dhMakeFormControl<string[]>(null),
  });

  // A plain arrow fn (not a computed): a computed that reads the id lazily inside
  // `.find` on the first, empty-list run freezes at `undefined` (issue 1549).
  selection = () => this.store.filteredProcesses().find((row) => row.id === this.navigation.id());

  protected readonly hasActiveFilters = computed(
    () =>
      this.store.dateRange() !== null ||
      this.store.suspendReasons().length > 0 ||
      this.store.processTypes().length > 0 ||
      this.store.owners().length > 0
  );

  constructor() {
    // The filter controls are event streams, so sync them into the store via RxJS
    // (the appropriate use of valueChanges, not an effect).
    this.form.controls.period.valueChanges.pipe(takeUntilDestroyed()).subscribe((period) => {
      if (period?.start && period?.end) {
        this.store.dateRange.set(period); // complete range chosen
      } else if (!period?.start && !period?.end) {
        this.store.dateRange.set(null); // cleared/reset
      }
      // partial (start only): ignore until end is picked
    });

    this.form.controls.suspendReasons.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((v) => this.store.suspendReasons.set(v ?? []));

    this.form.controls.processTypes.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((v) => this.store.processTypes.set(v ?? []));

    this.form.controls.owners.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((v) => this.store.owners.set(v ?? []));
  }
}
