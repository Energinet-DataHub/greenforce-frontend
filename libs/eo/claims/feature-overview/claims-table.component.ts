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
  Input,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';

import {
  WATT_TABLE,
  WattTableDataSource,
  WattTableColumnDef,
  WattPaginatorComponent,
} from '@energinet-datahub/watt/table';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { translations } from '@energinet-datahub/eo/translations';

import { Claim } from '@energinet-datahub/eo/claims/data-access-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WATT_TABLE, WattPaginatorComponent, WattEmptyStateComponent, TranslocoPipe],
  standalone: true,
  selector: 'eo-claims-table',
  styles: [
    `
      eo-claims-table {
        watt-empty-state {
          padding: var(--watt-space-l);
        }

        watt-paginator {
          display: block;
          margin: 0 -24px -24px -24px;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (columns) {
      <watt-table
        #table
        [loading]="loading"
        [columns]="columns"
        [dataSource]="dataSource"
        sortBy="start"
        sortDirection="desc"
      />
    }

    @if (loading === false && dataSource.filteredData.length === 0 && !hasError) {
      <watt-empty-state
        icon="custom-power"
        [title]="translations.claims.noData.title | transloco"
        [message]="translations.claims.noData.message | transloco"
      />
    }

    @if (loading === false && hasError) {
      <watt-empty-state
        icon="custom-power"
        [title]="translations.claims.error.title | transloco"
        [message]="translations.claims.error.message | transloco"
      />
    }

    <watt-paginator [for]="dataSource" />
  `,
})
export class EoClaimsTableComponent implements OnInit {
  private cd = inject(ChangeDetectorRef);
  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);

  @Input() loading = false;
  @Input() hasError = false;

  @Input()
  set claims(data: Claim[] | null) {
    this.dataSource.data = data || [];
  }

  @Input()
  set filter(value: string) {
    this.dataSource.filter = value;
  }

  dataSource: WattTableDataSource<Claim> = new WattTableDataSource(undefined);

  protected columns!: WattTableColumnDef<Claim>;
  protected translations = translations;

  ngOnInit(): void {
    this.sortData();
    this.setColumns();
  }

  private sortData(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.dataSource.sortData = (data: any[], sort: any) => {
      const isAsc = sort.direction === 'asc';

      if (!sort.active || sort.direction === '') {
        return data;
      } else if (sort.active === 'start' || sort.active === 'end') {
        return data.sort((a, b) => {
          return this.compare(
            a.consumptionCertificate[sort.active],
            b.consumptionCertificate[sort.active],
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

  private setColumns(): void {
    this.transloco
      .selectTranslation()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.columns = {
          claimId: {
            accessor: (x) => x.claimId,
            header: this.transloco.translate(this.translations.claims.claimIdTableHeader),
          },
          amount: {
            accessor: (x) => x.amount,
            header: this.transloco.translate(this.translations.claims.amountTableHeader),
          },
          start: {
            accessor: (x) => x.start,
            header: this.transloco.translate(this.translations.claims.startDateTableHeader),
          },
          end: {
            accessor: (x) => x.end,
            header: this.transloco.translate(this.translations.claims.endDateTableHeader),
          },
        };
        this.cd.detectChanges();
      });
  }

  compare(a: number, b: number, isAsc: boolean): number {
    if (a < b) {
      return isAsc ? -1 : 1;
    } else if (a > b) {
      return isAsc ? 1 : -1;
    } else {
      return 0;
    }
  }
}
