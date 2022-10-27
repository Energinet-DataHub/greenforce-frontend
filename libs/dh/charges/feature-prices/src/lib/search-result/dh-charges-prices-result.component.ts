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
import { CommonModule } from '@angular/common';
import {
  Component,
  NgModule,
  AfterViewInit,
  OnChanges,
  ViewChild,
  Input,
} from '@angular/core';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';
import { WattIconModule } from '@energinet-datahub/watt/icon';
import { WattTooltipModule } from '@energinet-datahub/watt/tooltip';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattButtonModule } from '@energinet-datahub/watt/button';

import { ChargeV1Dto } from '@energinet-datahub/dh/shared/domain';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';
import { ToLowerSort } from '@energinet-datahub/dh/shared/util-table';
import {
  DhChargesPricesDrawerComponent,
  DhChargesPricesDrawerScam,
} from '../drawer/dh-charges-prices-drawer.component';
import formatInTimeZone from 'date-fns-tz/formatInTimeZone';

@Component({
  selector: 'dh-charges-prices-result',
  templateUrl: './dh-charges-prices-result.component.html',
  styleUrls: ['./dh-charges-prices-result.component.scss'],
})
export class DhChargesPricesResultComponent
  implements AfterViewInit, OnChanges
{
  @ViewChild(DhSharedUiPaginatorComponent)
  paginator!: DhSharedUiPaginatorComponent;
  @ViewChild(MatSort) matSort!: MatSort;
  @ViewChild(DhChargesPricesDrawerComponent)
  chargePriceDrawer!: DhChargesPricesDrawerComponent;

  @Input() result?: Array<ChargeV1Dto>;
  @Input() isLoading = false;
  @Input() isInit = false;
  @Input() hasLoadingError = false;

  activeChargeId?: string | null;
  displayedColumns = [
    'chargeId',
    'chargeName',
    'chargeOwnerName',
    'icons',
    'chargeType',
    'resolution',
    'validFromDateTime',
    'validToDateTime',
  ];

  readonly dataSource: MatTableDataSource<ChargeV1Dto> =
    new MatTableDataSource<ChargeV1Dto>();

  private danishTimeZoneIdentifier = 'Europe/Copenhagen';
  private dateFormat = 'dd-MM-yyyy';
  private dateTimeFormat = 'dd-MM-yyyy HH:mm:ss';

  constructor(private translocoService: TranslocoService) {}

  ngOnChanges() {
    if (this.result) this.dataSource.data = this.result;

    this.dataSource.paginator = this.paginator?.instance;
    this.dataSource.sort = this.matSort;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator.instance;
    this.dataSource.sortingDataAccessor = ToLowerSort();
  }

  rowClicked(charge: ChargeV1Dto) {
    this.activeChargeId = charge.chargeId;
    this.chargePriceDrawer.openDrawer(charge);
  }

  downloadClicked() {
    if (this.result && this.result.length > 0) {
      const csvText = [this.createHeaderLabels(), ...this.createRows()]
        .map((x) => x.join(';'))
        .join('\n');

      this.saveFile(csvText);
    }
  }

  drawerClosed() {
    this.activeChargeId = null;
  }

  private createHeaderLabels(): string[] {
    return this.translocoService.translate<string[]>([
      'charges.prices.csvHeader.id',
      'charges.prices.csvHeader.name',
      'charges.prices.csvHeader.description',
      'charges.prices.csvHeader.owner',
      'charges.prices.csvHeader.taxIndicator',
      'charges.prices.csvHeader.vat',
      'charges.prices.csvHeader.transparentInvoicing',
      'charges.prices.csvHeader.type',
      'charges.prices.csvHeader.resolution',
      'charges.prices.csvHeader.validFromDate',
      'charges.prices.csvHeader.validToDate',
    ]);
  }

  private createRows(): (string | null | undefined)[][] {
    if (!this.result || this.result.length == 0) return [];
    return this.result.map((charge) => [
      charge.chargeId,
      charge.chargeName,
      charge.chargeDescription,
      charge.chargeOwnerName,
      this.translocoService.translate(
        `charges.taxIndicatorType.${charge.taxIndicator}`
      ),
      this.translocoService.translate(
        `charges.vatClassificationType.${charge.vatClassification}`
      ),
      this.translocoService.translate(
        `charges.transparentInvoicingType.${charge.transparentInvoicing}`
      ),
      this.translocoService.translate(
        `charges.chargeType.${charge.chargeType}`
      ),
      this.translocoService.translate(
        `charges.resolutionType.${charge.resolution}`
      ),
      formatInTimeZone(
        charge.validFromDateTime,
        this.danishTimeZoneIdentifier,
        this.dateFormat
      ),
      charge.validToDateTime == null
        ? ''
        : formatInTimeZone(
            charge.validToDateTime,
            this.danishTimeZoneIdentifier,
            this.dateFormat
          ),
    ]);
  }

  private saveFile(content: string): void {
    // Only browsers that support HTML5 download attribute
    const bom = '\ufeff';
    const blob = new Blob([bom, content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', this.createFilename());
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  private createFilename(): string {
    const fileType = '.csv';
    const dateString = (
      formatInTimeZone(
        new Date().toISOString(),
        this.danishTimeZoneIdentifier,
        this.dateTimeFormat
      ) ?? ''
    ).replace(/:/g, '_');
    return this.translocoService
      .translate('charges.prices.downloadFileName')
      .concat(' ', dateString, fileType);
  }
}

@NgModule({
  declarations: [DhChargesPricesResultComponent],
  exports: [DhChargesPricesResultComponent],
  imports: [
    CommonModule,
    MatTableModule,
    TranslocoModule,
    LetModule,
    WattIconModule,
    WattButtonModule,
    WattEmptyStateModule,
    DhFeatureFlagDirectiveModule,
    WattTooltipModule,
    WattSpinnerModule,
    DhSharedUiDateTimeModule,
    MatSortModule,
    DhChargesPricesDrawerScam,
    DhSharedUiPaginatorComponent,
    DhSharedUiDateTimeModule,
  ],
})
export class DhChargesPricesResultScam {}
