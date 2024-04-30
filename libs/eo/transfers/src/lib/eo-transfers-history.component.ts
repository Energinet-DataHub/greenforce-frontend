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
import { LowerCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';

import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { translations } from '@energinet-datahub/eo/translations';

import {
  EoListedTransfer,
  EoTransferAgreementsHistory,
  EoTransfersService,
} from './eo-transfers.service';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EoActivityLogComponent } from '@energinet-datahub/eo/activity-log';
import { ActivityLogEntryResponse } from '@energinet-datahub/eo/activity-log/data-access-api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-transfers-history',
  imports: [
    LowerCasePipe,
    WATT_TABLE,
    WattBadgeComponent,
    WattButtonComponent,
    WattDatePipe,
    WattEmptyStateComponent,
    WattPaginatorComponent,
    TranslocoPipe,
    EoActivityLogComponent,
  ],
  styles: [
    `
      h3,
      watt-empty-state {
        margin-bottom: var(--watt-space-m);
      }

      h3 {
        display: flex;
        align-items: center;
      }

      watt-badge {
        margin-left: var(--watt-space-s);
        border-radius: 50%;
        color: var(--watt-on-light-high-emphasis);
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: 9999px;
        min-width: 28px;
        padding: var(--watt-space-xs) var(--watt-space-s);
      }

      .spinner-container {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: var(--watt-space-xl);
      }
    `,
  ],
  standalone: true,
  template: `
    <eo-activity-log
      #log
      variant="solid"
      [showFilters]="false"
      [eventTypes]="['TransferAgreement']"
      [filter]="filter.bind(this)"
      [period]="{start: null, end: null}"
    />
  `,
})
export class EoTransfersHistoryComponent implements OnInit, OnChanges {
  @Input() transfer?: EoListedTransfer;

  @ViewChild(EoActivityLogComponent) log!: EoActivityLogComponent;

  private transloco = inject(TranslocoService);
  private cd = inject(ChangeDetectorRef);
  private transferService = inject(EoTransfersService);
  private destroyRef = inject(DestroyRef);

  protected translations = translations;
  protected dataSource = new WattTableDataSource<EoTransferAgreementsHistory>();
  protected columns!: WattTableColumnDef<EoTransferAgreementsHistory>;
  protected startDate: Date | null = null;
  protected endDate: Date | null = null;

  protected transferHistoryState = signal<{ loading: boolean; error: HttpErrorResponse | null }>({
    loading: false,
    error: null,
  });

  filter(logEntries: ActivityLogEntryResponse[]) {
    return logEntries.filter((entry) => {
      return entry.entityId === this.transfer?.id;
    });
  }

  ngOnInit(): void {
    this.transloco
      .selectTranslation()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.setColumns();
        this.cd.detectChanges();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transfer']?.currentValue && this.log && this.log.refresh) {
      this.log.refresh();
    }
  }

  refresh() {
    if(this.log && this.log.refetch) {
      this.log.refetch();
    }
  }

  private setColumns(): void {
    this.columns = {
      createdAt: {
        accessor: 'createdAt',
        header: this.transloco.translate(
          this.translations.transferAgreementHistory.timeTableHeader
        ),
      },
      action: {
        accessor: 'action',
        header: this.transloco.translate(
          this.translations.transferAgreementHistory.eventTableHeader
        ),
      },
    };
  }

  getHistory(transferAgreementId?: string): void {
    if (!transferAgreementId) return;

    this.transferHistoryState.set({ loading: true, error: null });

    this.transferService.getHistory(transferAgreementId).subscribe({
      next: (response) => {
        this.dataSource.data = response;
        this.transferHistoryState.set({ loading: false, error: null });
      },
      error: (error: HttpErrorResponse) => {
        this.transferHistoryState.set({ loading: false, error });
      },
    });
  }
}
