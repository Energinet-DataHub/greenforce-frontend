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
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import {
  WattTableColumnDef,
  WattTableComponent,
  IWattTableDataSource,
  WattTableCellDirective,
} from '@energinet-datahub/watt/table';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterSpacerComponent } from '@energinet-datahub/watt/vater';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattDateRangeChipComponent } from '@energinet-datahub/watt/datepicker';
import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';

import { EnergyUnitPipe, eoCertificatesRoutePath } from '@energinet-datahub/eo/shared/utilities';
import { EoCertificate, EoCertificateType } from '@energinet-datahub/eo/certificates/domain';
import {
  EoCertificatesService,
  sortCertificatesBy,
} from '@energinet-datahub/eo/certificates/data-access-api';
import { translations } from '@energinet-datahub/eo/translations';
import { WattDataFiltersComponent, WattDataTableComponent } from '@energinet-datahub/watt/data';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { getUnixTime, startOfToday, subDays } from 'date-fns';
import { WattFormChipDirective } from '@energinet-datahub/watt/field';
import { MatPaginator } from '@angular/material/paginator';
import { DOCUMENT } from '@angular/common';

interface CertificateFiltersForm {
  period: FormControl<{ start: Date; end: Date }>;
  type: FormControl<EoCertificateType[]>;
}

class AsyncDataSource<T> implements IWattTableDataSource<T> {
  private _data = signal<T[]>([]);
  private _paginator: MatPaginator | null = null;
  private _initialPageIndex = 1;
  private _initialPageSize = 50;

  /**
   * Subscription to the changes that should trigger an update to the table's rendered rows, such
   * as filtering, sorting, pagination, or base data changes.
   */
  private _renderChangesSubscription?: Subscription;

  totalCount = 0;
  sortData?: (sort: Sort) => void;

  filter = '';

  set data(data: T[]) {
    this._data.set(data);
  }

  get data(): T[] {
    return this._data();
  }

  set paginator(paginator: MatPaginator | null) {
    this._paginator = paginator;
    if (this._paginator) {
      this._paginator.pageIndex = this._initialPageIndex;
      this._paginator.pageSize = this._initialPageSize;
    }
  }

  get paginator(): MatPaginator | null {
    return this._paginator;
  }

  /* Data is filtered by the backend, so we just return the data */
  get filteredData(): T[] {
    return this._data();
  }

  /**
   * Instance of the MatSort directive used by the table to control its sorting. Sort changes
   * emitted by the MatSort will trigger an update to the table's rendered data.
   */
  get sort(): MatSort | null {
    return this._sort;
  }

  set sort(sort: MatSort | null) {
    this._sort = sort;
    this._renderChangesSubscription = this._sort?.sortChange.subscribe((sort: Sort) => {
      if (this.sortData) {
        this.sortData(sort);
      }
    });
  }

  private _sort!: MatSort | null;

  constructor(data: T[], initialPageIndex = 1, initialPageSize = 50) {
    this._data.set(data);
    this._initialPageIndex = initialPageIndex;
    this._initialPageSize = initialPageSize;
  }

  connect(): Observable<T[]> {
    return toObservable(this._data);
  }

  disconnect(): void {
    this._renderChangesSubscription?.unsubscribe();
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WattDataTableComponent,
    WattDataFiltersComponent,
    WattDropdownComponent,
    VaterStackComponent,
    WattDateRangeChipComponent,
    WattTableComponent,
    ReactiveFormsModule,
    WattFormChipDirective,
    VaterSpacerComponent,
    TranslocoPipe,
    WattButtonComponent,
    WattTableCellDirective,
  ],
  providers: [WattDatePipe, EnergyUnitPipe],
  styles: `
    :host {
      --watt-data-table-empty-state-margin: var(--watt-space-xl) 0;
    }
  `,
  template: `
    @if (columns) {
      <watt-data-table
        vater
        inset="m"
        [error]="state().hasError"
        [count]="dataSource.paginator?.length"
        (pageChanged)="pageChanged($event)"
        [enableSearch]="false"
      >
        <h3>{{ translations.certificates.title | transloco }}</h3>

        <watt-data-filters>
          <form [formGroup]="form">
            <vater-stack fill="vertical" gap="s" direction="row">
              <watt-date-range-chip [formControl]="form.controls.period" [placeholder]="false" />

              <watt-dropdown
                [options]="typeOptions"
                [chipMode]="true"
                formControlName="type"
                [multiple]="true"
                [placeholder]="translations.certificates.typeDropdown | transloco"
              />

              <vater-spacer />

              <watt-button
                icon="download"
                [loading]="exportingCertificates()"
                (click)="exportCertificates()"
                >{{ translations.certificates.exportCertificates | transloco }}</watt-button
              >
            </vater-stack>
          </form>
        </watt-data-filters>

        <watt-table
          [dataSource]="dataSource"
          [columns]="columns"
          sortBy="timestamp"
          sortDirection="desc"
          [loading]="state().isLoading"
        >
          <ng-container *wattTableCell="columns.action; let element">
            @if (element.federatedStreamId.registry && element.federatedStreamId.streamId) {
              <a (click)="goToDetails(element)">
                {{ translations.certificates.certificateDetailsLink | transloco }}
              </a>
            }
          </ng-container>
        </watt-table>
      </watt-data-table>
    }
  `,
})
export class EoCertificatesOverviewComponent implements OnInit {
  /* Page index */
  private _page!: number;
  @Input()
  set page(value: number | undefined) {
    this._page = value ?? 1;
  }

  get page() {
    return this._page;
  }

  /* Page size */
  private _pageSize!: number;
  private _defaultPageSize = 50;
  @Input()
  set pageSize(value: number | undefined) {
    this._pageSize = value ?? this._defaultPageSize;
  }

  get pageSize() {
    return this._pageSize;
  }

  /* Certificates type */
  private _type?: EoCertificateType;
  @Input()
  set type(value: EoCertificateType | undefined) {
    this._type = value;
  }
  get type() {
    return this._type;
  }

  /* The start of the time range */
  private _start!: number;
  @Input()
  set start(value: number | undefined) {
    this._start = value ?? getUnixTime(subDays(startOfToday(), 30));
  }
  get start() {
    return this._start;
  }

  /* The end of the time range */
  private _end!: number;
  @Input()
  set end(value: number | undefined) {
    this._end = value ?? getUnixTime(startOfToday());
  }
  get end() {
    return this._end;
  }

  /* Which type to sort by */
  private _sortBy!: 'time' | 'meteringPoint' | 'amount' | 'certificateType';
  private _defaultSortBy: 'time' | 'meteringPoint' | 'amount' | 'certificateType' = 'time';

  @Input()
  set sortBy(value: 'time' | 'meteringPoint' | 'amount' | 'certificateType' | undefined) {
    this._sortBy = value ?? this._defaultSortBy;
  }

  get sortBy() {
    return this._sortBy;
  }

  /* Sort direction */
  private _sortDirection!: SortDirection;
  private _defaultSortDirection: SortDirection = 'desc';

  @Input()
  set sortDirection(value: SortDirection | undefined) {
    this._sortDirection = value ?? this._defaultSortDirection;
  }

  get sortDirection() {
    return this._sortDirection;
  }

  private toastService: WattToastService = inject(WattToastService);
  private transloco = inject(TranslocoService);
  private cd = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private documentRef = inject(DOCUMENT);

  private datePipe: WattDatePipe = inject(WattDatePipe);
  private energyUnitPipe: EnergyUnitPipe = inject(EnergyUnitPipe);

  private certificatesService: EoCertificatesService = inject(EoCertificatesService);

  @ViewChild(WattPaginatorComponent) paginator!: WattPaginatorComponent<EoCertificate>;

  protected state = signal<{ hasError: boolean; isLoading: boolean }>({
    hasError: false,
    isLoading: false,
  });

  protected form!: FormGroup<CertificateFiltersForm>;
  protected typeOptions!: WattDropdownOption[];

  protected translations = translations;
  protected columns!: WattTableColumnDef<EoCertificate>;

  protected dataSource!: AsyncDataSource<EoCertificate>;
  protected exportingCertificates = signal<boolean>(false);

  ngOnInit() {
    this.dataSource = new AsyncDataSource<EoCertificate>([], (this.page ?? 1) - 1, this.pageSize);
    this.initForm();

    this.transloco
      .selectTranslation()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.setColumns();
        this.dataSource.sortData = this.sortData.bind(this);

        this.typeOptions = [
          {
            value: 'production',
            displayValue: this.transloco.translate(this.translations.certificates.production),
          },
          {
            value: 'consumption',
            displayValue: this.transloco.translate(this.translations.certificates.consumption),
          },
        ];

        this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((changes) => {
          if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
          }

          if (changes.period) {
            this.router.navigate([this.transloco.getActiveLang(), eoCertificatesRoutePath], {
              queryParams: {
                start: getUnixTime(changes.period.start),
                end: getUnixTime(changes.period.end),
                type: changes.type?.length === 1 ? changes.type.toString() : undefined,
              },
              queryParamsHandling: 'merge',
            });

            this.loadData();
          }
        });

        this.loadData();
      });
  }

  private initForm() {
    const start = new Date((this.start as number) * 1000);
    const end = new Date((this.end as number) * 1000);
    const type: EoCertificateType[] = this.type
      ? [this.type]
      : [EoCertificateType.Production, EoCertificateType.Consumption];

    this.form = new FormGroup({
      period: new FormControl(
        {
          start: start as Date,
          end: end as Date,
        },
        { nonNullable: true }
      ),
      type: new FormControl<EoCertificateType[]>(type, {
        nonNullable: true,
      }),
    });
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

  goToDetails(element: EoCertificate) {
    this.router.navigate(
      [
        this.transloco.getActiveLang(),
        eoCertificatesRoutePath,
        element.federatedStreamId.registry,
        element.federatedStreamId.streamId,
      ],
      {
        state: {
          'from-certificates-overview': true,
        },
      }
    );
  }

  pageChanged(event: { pageIndex: number; pageSize: number }) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    const newPage = event.pageIndex + 1;

    this.router.navigate([this.transloco.getActiveLang(), eoCertificatesRoutePath], {
      queryParams: {
        page: newPage !== 1 ? newPage : undefined,
        pageSize: event.pageSize !== this._defaultPageSize ? event.pageSize : undefined,
      },
      queryParamsHandling: 'merge',
    });
    this.loadData();

    setTimeout(() => {
      this.documentRef.querySelector('.watt-main-content')?.scrollTo(0, 0);
    });
  }

  private setColumns(): void {
    this.columns = {
      time: {
        accessor: (x) => x.time,
        header: this.transloco.translate(this.translations.certificates.timeTableHeader),
      },
      meteringPoint: {
        accessor: (x) =>
          x.attributes.assetId ?? x.attributes.energyTag_ProductionDeviceUniqueIdentification,
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
      action: {
        accessor: (x) =>
          x.attributes.assetId ?? x.attributes.energyTag_ProductionDeviceUniqueIdentification,
        header: '',
      },
    };

    this.cd.detectChanges();
  }

  private getCertificateTypeFilter(): 'production' | 'consumption' | undefined {
    const typeArray = this.form.controls.type.value;
    let type: 'production' | 'consumption' | undefined;
    if (Array.isArray(typeArray) && typeArray.length === 1) {
      type = typeArray[0];
    } else {
      type = undefined;
    }
    return type;
  }

  private loadData() {
    this.state.set({ ...this.state(), isLoading: true });
    this.dataSource.data = []; // We empty the data to show the loading spinner

    this.certificatesService
      .getCertificates({
        pageIndex: (this.page ?? 1) - 1,
        pageSize: this.pageSize as number,
        sortBy: this.getSortBy(this.sortBy as sortCertificatesBy),
        sort: this.sortDirection as SortDirection,
        type: this.getCertificateTypeFilter(),
        start: this.form.controls.period.value.start as Date,
        end: this.form.controls.period.value.end as Date,
      })
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
          this.dataSource.data = certificates.result as EoCertificate[];
          if (this.dataSource.paginator) {
            this.dataSource.paginator.length = certificates.metadata.total;
          }
          this.state.set({ ...this.state(), isLoading: false, hasError: false });
        },
        error: () => {
          this.state.set({ ...this.state(), isLoading: false, hasError: true });
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

  sortData(sort: Sort): void {
    if (!sort.active || sort.direction === '' || sort.direction === this._defaultSortDirection) {
      this.sortBy = this._defaultSortBy;
      this.sortDirection = this._defaultSortDirection;

      this.router.navigate([this.transloco.getActiveLang(), eoCertificatesRoutePath], {
        queryParams: { sortBy: undefined, sort: undefined },
        queryParamsHandling: 'merge',
      });
    } else {
      this.sortBy = sort.active as never;
      this.sortDirection = sort.direction;

      this.router.navigate([this.transloco.getActiveLang(), eoCertificatesRoutePath], {
        queryParams: { sortBy: this.sortBy, sort: this.sortDirection },
        queryParamsHandling: 'merge',
      });
    }

    this.loadData();
  }
}
