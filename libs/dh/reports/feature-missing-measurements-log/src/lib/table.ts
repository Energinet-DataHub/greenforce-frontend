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
import { ReactiveFormsModule } from '@angular/forms';
import { Component, effect, inject, Injectable, input, output } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import {
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
} from '@energinet-datahub/watt/table';
import { WattDataIntlService, WattDataTableComponent } from '@energinet-datahub/watt/data';

@Injectable()
export class DhReportsMissingMeasurementsLogIntl extends WattDataIntlService {
  constructor(private readonly transloco: TranslocoService) {
    super();
    this.setDefault();
  }

  setCreated() {
    this.transloco
      .selectTranslateObject('reports.missingMeasurementsLog')
      .subscribe((translations) => {
        this.emptyTitle = translations.createdMessage;
        this.emptyText = translations.message;
        this.changes.next();
      });
  }

  setDefault() {
    this.transloco
      .selectTranslateObject('reports.missingMeasurementsLog')
      .subscribe((translations) => {
        this.emptyTitle = translations.message;
        this.emptyText = '';
        this.changes.next();
      });
  }
}

/* eslint-disable @angular-eslint/component-class-suffix */
@Component({
  selector: 'dh-reports-missing-measurements-log-table',
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    WattTableComponent,
    WattButtonComponent,
    VaterUtilityDirective,
    WattDataTableComponent,
  ],
  providers: [{ provide: WattDataIntlService, useClass: DhReportsMissingMeasurementsLogIntl }],
  template: `
    <watt-data-table
      *transloco="let t; read: 'reports.missingMeasurementsLog'"
      vater
      inset="ml"
      [enableSearch]="false"
      [enableCount]="false"
      emptyStateIcon="construction"
    >
      <h3>{{ t('results') }}</h3>

      <watt-button variant="secondary" icon="plus" data-testid="newRequest" (click)="new.emit()">
        {{ t('button') }}
      </watt-button>

      <watt-table
        *transloco="let resolveHeader; read: 'reports.missingMeasurementsLog.columns'"
        [dataSource]="dataSource"
        [columns]="columns"
        [resolveHeader]="resolveHeader"
      />
    </watt-data-table>
  `,
})
export class DhReportsMissingMeasurementsLogTable {
  private readonly intl = inject(WattDataIntlService);
  new = output();
  columns: WattTableColumnDef<Request> = {};
  created = input<boolean>(false);

  dataSource = new WattTableDataSource([]);

  constructor() {
    effect(() => {
      const created = this.created();
      created
        ? (this.intl as DhReportsMissingMeasurementsLogIntl).setCreated()
        : (this.intl as DhReportsMissingMeasurementsLogIntl).setDefault();
    });
  }
}
