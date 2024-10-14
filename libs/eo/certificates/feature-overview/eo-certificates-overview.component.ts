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
import { map, Observable, of } from 'rxjs';
import { RouterModule } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { Sort, SortDirection } from '@angular/material/sort';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import {
  WattTableColumnDef,
  WattTableComponent,
  IWattTableDataSource,
} from '@energinet-datahub/watt/table';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
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
import { endOfToday, getUnixTime, startOfToday, subDays } from 'date-fns';
import { WattFormChipDirective } from '@energinet-datahub/watt/field';
import { MatPaginator } from '@angular/material/paginator';

interface CertificateFiltersForm {
  period: FormControl<{ start: number | null; end: number | null }>;
  type: FormControl<('production' | 'consumption')[] | undefined>;
}

class AsyncDataSource<T> implements IWattTableDataSource<T> {
  private _data = signal<T[]>([]);
  private _filteredData = signal<T[]>([]);

  totalCount = 0;
  paginator: MatPaginator | null = null;
  sort = null;
  filter = '';

  set data(data: T[]) {
    this._data.set(data);
  }

  get data(): T[] {
    return this._data();
  }

  get filteredData(): T[] {
    return this._data(); // TODO: FIX THIS
  }

  constructor(data: T[]) {
    this._data.set(data);
  }

  connect(): Observable<T[]> {
    return toObservable(this._data);
  }

  disconnect(): void {
    throw new Error('Method not implemented.');
  }

  sortData(data: T[]): T[] {
    console.log('sortData', data);
    return data;
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
  ],
  providers: [WattDatePipe, EnergyUnitPipe],
  standalone: true,
  template: `
    @if (columns) {
      <watt-data-table
        vater
        inset="m"
        [error]="state().hasError"
        [count]="dataSource.paginator?.length"
        (pageChanged)="pageChanged()"
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
        />
      </watt-data-table>
    }
  `,
})
export class EoCertificatesOverviewComponent implements OnInit {
  private toastService: WattToastService = inject(WattToastService);
  private transloco = inject(TranslocoService);
  private cd = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  private datePipe: WattDatePipe = inject(WattDatePipe);
  private energyUnitPipe: EnergyUnitPipe = inject(EnergyUnitPipe);

  private certificatesService: EoCertificatesService = inject(EoCertificatesService);

  @ViewChild(WattPaginatorComponent) paginator!: WattPaginatorComponent<EoCertificate>;

  protected state = signal<{ hasError: boolean; isLoading: boolean }>({
    hasError: false,
    isLoading: false,
  });

  protected form: FormGroup<CertificateFiltersForm> = new FormGroup({
    period: new FormControl(this.last30days(), { nonNullable: true }),
    type: new FormControl<('production' | 'consumption')[] | undefined>(undefined, {
      nonNullable: true,
    }),
  });

  protected typeOptions!: WattDropdownOption[];

  protected translations = translations;
  protected columns!: WattTableColumnDef<EoCertificate>;

  protected dataSource: AsyncDataSource<EoCertificate> = new AsyncDataSource<EoCertificate>([]);
  protected exportingCertificates = signal<boolean>(false);

  protected defaultSortBy: 'time' | 'meteringPoint' | 'amount' | 'certificateType' = 'time';
  protected defaultSortDirection: SortDirection = 'desc';
  protected sortBy = this.defaultSortBy;
  protected sortDirection: SortDirection = this.defaultSortDirection;

  ngOnInit() {
    this.initForm();

    this.transloco
      .selectTranslation()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.setColumns();
        this.dataSource.sortData = (data) => {
          console.log('sortData', data);
          return data;
        }

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

        this.form.controls.type.setValue(['production', 'consumption']);

        this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
          if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
          }
          this.loadData();
        });

        this.loadData();
      });
  }

  private initForm() {
    this.form = new FormGroup({
      period: new FormControl(this.last30days(), { nonNullable: true }),
      type: new FormControl<('production' | 'consumption')[] | undefined>(undefined, {
        nonNullable: true,
      }),
    });
  }

  private last30days(): { start: number | null; end: number | null } {
    return {
      start: getUnixTime(subDays(startOfToday(), 30)) * 1000, // 30 days ago at 00:00
      end: getUnixTime(endOfToday()) * 1000, // Today at 23:59:59
    };
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

  pageChanged() {
    this.loadData();
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

    const pageIndex = this.dataSource.paginator?.pageIndex || 0;
    const pageSize = this.dataSource.paginator?.pageSize || 50;
    const sortBy = this.getSortBy(this.sortBy);
    const sort = this.sortDirection;

    this.certificatesService
      .getCertificates({
        pageIndex,
        pageSize,
        sortBy,
        sort,
        type: this.getCertificateTypeFilter(),
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

  sortData(sort: Sort) {
    console.log('sortData', sort);
    /*
    if (!sort.active || sort.direction === '') {
      this.sortBy = this.defaultSortBy;
      this.sortDirection = this.defaultSortDirection;
    } else {
      this.sortBy = sort.active as never;
      this.sortDirection = sort.direction;
    }

    this.loadData();*/
  }
}
