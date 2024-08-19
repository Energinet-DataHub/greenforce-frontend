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
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { map } from 'rxjs';
import { RouterModule } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { Sort, SortDirection } from '@angular/material/sort';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { VaterStackComponent, VaterSpacerComponent } from '@energinet-datahub/watt/vater';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import {
  WATT_TABLE,
  WattTableColumnDef,
  WattTableDataSource,
  WattPaginatorComponent,
} from '@energinet-datahub/watt/table';
import { WattDatePipe } from '@energinet-datahub/watt/utils/date';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { EnergyUnitPipe, eoCertificatesRoutePath } from '@energinet-datahub/eo/shared/utilities';
import { EoCertificate, EoCertificateType } from '@energinet-datahub/eo/certificates/domain';
import {
  EoCertificatesService,
  sortCertificatesBy,
} from '@energinet-datahub/eo/certificates/data-access-api';
import { translations } from '@energinet-datahub/eo/translations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WATT_TABLE,
    WattPaginatorComponent,
    WattEmptyStateComponent,
    RouterModule,
    VaterStackComponent,
    VaterSpacerComponent,
    WATT_CARD,
    TranslocoPipe,
    WattButtonComponent,
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
          <h3 class="watt-on-light--high-emphasis">
            {{ translations.certificates.tableHeader | transloco }}
          </h3>
          <div class="badge">
            <small>{{ totalCount() }}</small>
          </div>
          <vater-spacer />
          <watt-button
            icon="download"
            [loading]="exportingCertificates()"
            (click)="exportCertificates()"
            >{{ translations.certificates.exportCertificates | transloco }}</watt-button
          >
        </vater-stack>
      </watt-card-title>

      @if (columns) {
        <watt-table
          #table
          [loading]="loading()"
          [columns]="columns"
          [dataSource]="dataSource"
          [sortBy]="defaultSortBy"
          [sortDirection]="defaultSortDirection"
          (sortChange)="sortData($event)"
        >
          <ng-container *wattTableCell="columns.action; let element">
            @if (element.federatedStreamId.registry && element.federatedStreamId.streamId) {
              <a
                class="link"
                routerLink="/${eoCertificatesRoutePath}/{{ element.federatedStreamId.registry }}/{{
                  element.federatedStreamId.streamId
                }}"
              >
                {{ translations.certificates.certificateDetailsLink | transloco }}
              </a>
            }
          </ng-container>
        </watt-table>
      }

      @if (!loading() && dataSource.filteredData.length === 0 && !hasError()) {
        <watt-empty-state
          icon="custom-power"
          [title]="translations.certificates.noData.title | transloco"
          [message]="translations.certificates.noData.message | transloco"
        />
      }

      @if (!loading() && hasError()) {
        <watt-empty-state
          icon="custom-power"
          [title]="translations.certificates.error.title | transloco"
          [message]="translations.certificates.error.message | transloco"
        />
      }

      <watt-paginator
        [length]="totalCount()"
        [pageSize]="pageSize"
        [pageIndex]="pageIndex()"
        [for]="dataSource"
        (changed)="pageChanged($event)"
      />
    </watt-card>
  `,
})
export class EoCertificatesOverviewComponent implements OnInit {
  private toastService: WattToastService = inject(WattToastService);
  private certificatesService: EoCertificatesService = inject(EoCertificatesService);
  private datePipe: WattDatePipe = inject(WattDatePipe);
  private energyUnitPipe: EnergyUnitPipe = inject(EnergyUnitPipe);
  private transloco = inject(TranslocoService);
  private cd = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  @ViewChild(WattPaginatorComponent) paginator!: WattPaginatorComponent<EoCertificate>;

  protected translations = translations;
  protected columns!: WattTableColumnDef<EoCertificate>;

  protected set search(value: string) {
    this.dataSource.filter = value;
  }
  protected dataSource: WattTableDataSource<EoCertificate> = new WattTableDataSource(undefined);
  protected totalCount = signal<number>(0);
  protected pageIndex = signal<number>(0);
  protected pageSize = 50;
  protected exportingCertificates = signal<boolean>(false);

  protected defaultSortBy: 'time' | 'meteringPoint' | 'amount' | 'certificateType' = 'time';
  protected defaultSortDirection: SortDirection = 'desc';
  protected sortBy = this.defaultSortBy;
  protected sortDirection: SortDirection = this.defaultSortDirection;

  protected loading = signal<boolean>(false);
  protected hasError = signal<boolean>(false);

  ngOnInit() {
    this.setColumns();
    this.loadData(
      this.pageIndex() + 1,
      this.pageSize,
      this.getSortBy(this.defaultSortBy),
      this.sortDirection
    );
  }

  exportCertificates() {
    this.exportingCertificates.set(true);
    this.certificatesService.exportCertificates().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'certificates.xlsx';
        a.click();
        this.exportingCertificates.set(false);
      },
      error: () => {
        this.toastService.open({
          message: this.transloco.translate(this.translations.certificates.exportFailed),
          type: 'danger',
        });
        this.exportingCertificates.set(false);
      },
    });
  }

  pageChanged(event: {
    previousPageIndex?: number;
    pageIndex: number;
    pageSize: number;
    length: number;
  }) {
    this.pageIndex.set(event.pageIndex);
    this.loadData(
      event.pageIndex + 1,
      event.pageSize,
      this.getSortBy(this.sortBy),
      this.sortDirection
    );
  }

  private setColumns(): void {
    this.transloco
      .selectTranslation()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.columns = {
          time: {
            accessor: (x) => x.time,
            header: this.transloco.translate(this.translations.certificates.timeTableHeader),
          },
          meteringPoint: {
            accessor: (x) => x.attributes.assetId,
            header: this.transloco.translate(this.translations.certificates.gsrnTableHeader),
            sort: false,
          },
          amount: {
            accessor: (x) => x.amount,
            header: this.transloco.translate(this.translations.certificates.amountTableHeader),
          },
          certificateType: {
            accessor: (x) => {
              if (x.certificateType.toLowerCase() === EoCertificateType.Production) {
                return this.transloco.translate(this.translations.certificates.productionType);
              } else if (x.certificateType.toLowerCase() === EoCertificateType.Consumption) {
                return this.transloco.translate(this.translations.certificates.consumptionType);
              } else {
                return x.certificateType;
              }
            },
            header: this.transloco.translate(this.translations.certificates.typeTableHeader),
          },
          action: { accessor: (x) => x.attributes.assetId, header: '' },
        };

        this.dataSource.sortData = (data: EoCertificate[]) => {
          return data;
        };

        this.cd.detectChanges();
      });
  }

  private loadData(
    page: number,
    pageSize: number,
    sortBy: sortCertificatesBy,
    sortDirection: SortDirection
  ) {
    this.loading.set(true);
    this.dataSource.data = [];
    // This makes sure the paginator is keeping track of the total count
    setTimeout(() => {
      this.paginator.instance.length = this.totalCount();
    });

    this.certificatesService
      .getCertificates(page, pageSize, sortBy, sortDirection)
      .pipe(
        map((certificates) => {
          return {
            ...certificates,
            result: certificates.result.map((certificate) => {
              const start = this.datePipe.transform(certificate.start, 'longAbbr');
              const end = this.datePipe.transform(certificate.end, 'time');

              return {
                ...certificate,
                time: `${start}-${end}`,
                amount: this.energyUnitPipe.transform(certificate.quantity) as string,
              };
            }),
          };
        })
      )
      .subscribe({
        next: (certificates) => {
          this.totalCount.set(certificates.metadata.total);

          this.dataSource.data = this.insertOrOverwrite(
            new Array(this.totalCount()).fill(null),
            this.pageIndex() * this.pageSize,
            certificates.result
          );
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

  private getSortBy(sortBy: string): sortCertificatesBy {
    switch (sortBy) {
      case 'time':
        return 'end' as sortCertificatesBy;
      case 'amount':
        return 'quantity' as sortCertificatesBy;
      case 'certificateType':
        return 'type' as sortCertificatesBy;
      default:
        return 'end' as sortCertificatesBy;
    }
  }

  private insertOrOverwrite<T>(array: T[], index: number, items: T[]): T[] {
    // Remove elements starting from the index and insert new items
    array.splice(index, items.length, ...items);
    return array;
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this.sortBy = this.defaultSortBy;
      this.sortDirection = this.defaultSortDirection;
    } else {
      this.sortBy = sort.active as never;
      this.sortDirection = sort.direction;
    }

    this.loadData(
      this.pageIndex() + 1,
      this.pageSize,
      this.getSortBy(this.sortBy),
      this.sortDirection
    );
  }
}
