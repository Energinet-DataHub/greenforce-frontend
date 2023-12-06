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
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { map } from 'rxjs';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WattSearchComponent } from '@energinet-datahub/watt/search';

import { EnergyUnitPipe, eoCertificatesRoutePath } from '@energinet-datahub/eo/shared/utilities';
import { EoCertificate } from '@energinet-datahub/eo/certificates/domain';
import { EoCertificatesService } from '@energinet-datahub/eo/certificates/data-access-api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    WATT_TABLE,
    WattPaginatorComponent,
    WattEmptyStateComponent,
    RouterModule,
    VaterStackComponent,
    VaterSpacerComponent,
    WattSearchComponent,
    WATT_CARD,
  ],
  providers: [WattDatePipe, EnergyUnitPipe],
  standalone: true,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      :host {
        .badge {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          background-color: var(--watt-color-neutral-grey-300);
          color: var(--watt-on-light-high-emphasis);
          border-radius: 24px;
          padding: 2px 8px;

          small {
            @include watt.typography-font-weight('semi-bold');
          }
        }

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
  template: `
    <watt-card>
      <watt-card-title>
        <vater-stack direction="row" gap="s">
          <h3 class="watt-on-light--high-emphasis">Results</h3>
          <div class="badge">
            <small>{{ this.dataSource.filteredData.length }}</small>
          </div>
          <vater-spacer />
          <watt-search label="Search" (search)="search = $event" />
        </vater-stack>
      </watt-card-title>

      <watt-table
        #table
        [loading]="loading()"
        [columns]="columns"
        [dataSource]="dataSource"
        sortBy="time"
        sortDirection="desc"
      >
        <ng-container *wattTableCell="columns.action; let element">
          <a
            class="link"
            routerLink="/${eoCertificatesRoutePath}/{{ element.federatedStreamId.streamId }}"
          >
            View certificate
          </a>
        </ng-container>
      </watt-table>

      <watt-empty-state
        *ngIf="!loading() && dataSource.filteredData.length === 0 && !hasError()"
        icon="custom-power"
        title="No certificates found"
        message="You do not have any certificates."
      />

      <watt-empty-state
        *ngIf="!loading() && hasError()"
        icon="custom-power"
        title="Oops! Something went wrong."
        message="Please try reloading the page.."
      />

      <watt-paginator [for]="dataSource" />
    </watt-card>
  `,
})
export class EoCertificatesOverviewComponent implements OnInit {
  private certificatesService: EoCertificatesService = inject(EoCertificatesService);
  private datePipe: WattDatePipe = inject(WattDatePipe);
  private energyUnitPipe: EnergyUnitPipe = inject(EnergyUnitPipe);

  protected columns: WattTableColumnDef<EoCertificate> = {
    time: { accessor: (x) => x.time },
    meteringPoint: { accessor: (x) => x.attributes.assetId },
    amount: { accessor: (x) => x.amount },
    certificateType: { accessor: (x) => x.certificateType, header: 'Type' },
    action: { accessor: (x) => x.attributes.assetId, header: '' },
  };

  protected set search(value: string) {
    this.dataSource.filter = value;
  }
  protected dataSource: WattTableDataSource<EoCertificate> = new WattTableDataSource(undefined);
  protected loading = signal<boolean>(false);
  protected hasError = signal<boolean>(false);

  ngOnInit() {
    this.loadData();
    this.sortData();
  }

  private loadData() {
    this.loading.set(true);
    this.certificatesService.getCertificates().pipe(
      map((certificates: EoCertificate[]) => {
        return certificates.map((certificate) => {
          const start = this.datePipe.transform(certificate.start, 'longAbbr');
          const end = this.datePipe.transform(certificate.end, 'time');

          return {
            ...certificate,
            time: `${start}-${end}`,
            amount: this.energyUnitPipe.transform(certificate.quantity) as string,
          };
        });
      })
    ).subscribe({
      next: (certificates) => {
        this.dataSource.data = certificates;
        this.loading.set(false);
        this.hasError.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.loading.set(false);
        this.dataSource.data = [];
      },
    });
  }

  private sortData() {
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     this.dataSource.sortData = (data: any[], sort: any) => {
      const isAsc = sort.direction === 'asc';

      if (!sort.active || sort.direction === '') {
        return data;
      } else if (sort.active === 'time') {
        return data.sort((a, b) => {
          return this.compare(
            a.start,
            b.start,
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
}
