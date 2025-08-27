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
import { inject, Signal } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { OperationVariables } from '@apollo/client/core';
import { wattFormatDate } from '@energinet-datahub/watt/date';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattTableDataSource } from '@energinet-datahub/watt/table';

import { LazyQueryResult } from '@energinet-datahub/dh/shared/util-apollo';
import { dhAppEnvironmentToken } from '@energinet-datahub/dh/shared/environments';

import { exportToCSV } from './export-to-csv';

export class GenerateCSV<TResult, TQueryResult, TVariables extends OperationVariables> {
  private env = inject(dhAppEnvironmentToken);
  private toastService = inject(WattToastService);

  constructor(
    private query: LazyQueryResult<TQueryResult, TVariables> | null,
    private dataSource: WattTableDataSource<TResult> | null,
    private signalArray: Signal<TResult[]> | null,
    private variables: TVariables | null,
    private headers: string[],
    private mapper: ((data: TResult[]) => string[][]) | null,
    private selector: ((data: TQueryResult) => TResult[]) | null
  ) {}

  static fromQuery<TResult, TQueryResult, TVariables extends OperationVariables>(
    query: LazyQueryResult<TQueryResult, TVariables>,
    selector: (data: TQueryResult) => TResult[]
  ) {
    return new GenerateCSV(query, null, null, null, [], null, selector);
  }

  static fromWattTableDataSource<TResult>(data: WattTableDataSource<TResult>) {
    return new GenerateCSV(null, data, null, null, [], null, null);
  }

  static fromSignalArray<TResult>(data: Signal<TResult[]>) {
    return new GenerateCSV(null, null, data, null, [], null, null);
  }

  addVariables(variables: TVariables) {
    if (this.query === null) throw new Error('No query defined');
    this.variables = { ...this.variables, ...variables };
    return this;
  }

  addHeaders(headers: string[]) {
    this.headers = [...this.headers, ...headers];
    return this;
  }

  mapLines(mapper: (data: TResult[]) => string[][]) {
    this.mapper = mapper;
    return this;
  }

  async generate(translatePath: string) {
    if (this.headers.length === 0) throw new Error('No headers defined');
    if (this.mapper === null) throw new Error('No mapper defined');

    this.showToast('shared.downloadStart', 'loading');

    let data: TResult[] | null = null;

    if (this.query !== null && this.selector !== null) {
      if (this.variables === null) throw new Error('No variables defined');
      data = this.selector((await this.query.query({ variables: this.variables })).data);
    }

    if (this.dataSource !== null && this.dataSource.sort) {
      data = this.dataSource.sortData(this.dataSource.filteredData, this.dataSource.sort);
    }

    if (this.signalArray !== null) {
      data = this.signalArray();
    }

    if (data === undefined) return this.showToast('shared.downloadFailed', 'danger');

    const lines = data ? this.mapper(data) : [];

    const filename = translate(translatePath, {
      datetime: wattFormatDate(new Date(), 'long'),
      env: translate(`environmentName.${this.env.current}`),
    });

    exportToCSV({ headers: this.headers, lines, fileName: filename });

    setTimeout(() => this.toastService.dismiss(), 500);
  }

  private showToast(message: string, type: 'danger' | 'loading') {
    this.toastService?.open({
      type,
      message: translate(message),
    });
  }
}
