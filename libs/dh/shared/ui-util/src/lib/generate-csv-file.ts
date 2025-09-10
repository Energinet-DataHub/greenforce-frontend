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

import { HttpClient } from '@angular/common/http';

import { toFile } from './stream-to-file';
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/no-duplicate-string */
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
    private selector: ((data: TQueryResult) => TResult[] | undefined | null) | null
  ) {}

  static fromStream(getUrl: () => string) {
    return new GenerateCSVFromStream(getUrl);
  }

  static fromQuery<TResult, TQueryResult, TVariables extends OperationVariables>(
    query: LazyQueryResult<TQueryResult, TVariables>,
    selector: (data: TQueryResult) => TResult[] | undefined | null
  ) {
    return new GenerateCSV(query, null, null, null, [], null, selector);
  }

  static fromWattTableDataSource<TResult>(data: WattTableDataSource<TResult>) {
    return new GenerateCSV(null, data, null, null, [], null, null);
  }

  static fromSignalArray<TResult>(data: Signal<TResult[]>) {
    return new GenerateCSV(null, null, data, null, [], null, null);
  }

  static fromQueryWithRawResult<TResult, TQueryResult, TVariables extends OperationVariables>(
    query: LazyQueryResult<TQueryResult, TVariables>,
    selector: (data: TQueryResult) => TResult extends string ? TResult : never
  ) {
    return new GenrateFromQueryWithRawResult(query, selector, null);
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

    let data: TResult[] | undefined | null = null;

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

    if (!data) return this.showToast('shared.downloadFailed', 'danger');

    const lines = this.mapper(data);

    const filename = translate(translatePath, {
      datetime: wattFormatDate(new Date(), 'long'),
      env: translate(`environmentName.${this.env.current}`),
    });

    const csvData = `${this.headers.join(';')}\n${lines.map((x) => x.join(';')).join('\n')}`;

    toFile({ data: csvData, name: `${filename}.csv`, type: 'text/csv;charset=utf-8;' });

    setTimeout(() => this.toastService.dismiss(), 500);
  }

  private showToast(message: string, type: 'danger' | 'loading') {
    this.toastService?.open({
      type,
      message: translate(message),
    });
  }
}

class GenrateFromQueryWithRawResult<TResult, TQueryResult, TVariables extends OperationVariables> {
  private env = inject(dhAppEnvironmentToken);
  private toastService = inject(WattToastService);

  constructor(
    private query: LazyQueryResult<TQueryResult, TVariables> | null,
    private selector: ((data: TQueryResult) => TResult extends string ? TResult : never) | null,
    private variables: TVariables | null
  ) {}

  addVariables(variables: TVariables) {
    if (this.query === null) throw new Error('No query defined');
    this.variables = { ...this.variables, ...variables };
    return this;
  }

  async generate(translatePath: string) {
    this.showToast('shared.downloadStart', 'loading');

    let data: string | null = null;

    if (this.query !== null && this.selector !== null) {
      if (this.variables === null) throw new Error('No variables defined');
      data = this.selector((await this.query.query({ variables: this.variables })).data);
    }

    if (!data) return this.showToast('shared.downloadFailed', 'danger');

    const filename = translate(translatePath, {
      datetime: wattFormatDate(new Date(), 'long'),
      env: translate(`environmentName.${this.env.current}`),
    });

    toFile({ data: data, name: `${filename}.csv`, type: 'text/csv;charset=utf-8;' });

    setTimeout(() => this.toastService.dismiss(), 500);
  }

  private showToast(message: string, type: 'danger' | 'loading') {
    this.toastService?.open({
      type,
      message: translate(message),
    });
  }
}

class GenerateCSVFromStream {
  private httpClient = inject(HttpClient);
  private env = inject(dhAppEnvironmentToken);
  private toastService = inject(WattToastService);

  constructor(private getUrl: () => string) {}

  generate(translatePath: string) {
    this.showToast('shared.downloadStart', 'loading');

    return new Promise((resolve, reject) => {
      this.httpClient.get(this.getUrl(), { responseType: 'text' }).subscribe({
        next: (data) => {
          const filename = translate(translatePath, {
            datetime: wattFormatDate(new Date(), 'long'),
            env: translate(`environmentName.${this.env.current}`),
          });

          toFile({ data, name: `${filename}.csv`, type: 'text/csv;charset=utf-8;' });
        },
        error: () => {
          this.showToast('shared.downloadFailed', 'danger');
          reject(false);
        },
        complete: () => {
          this.toastService.dismiss();
          resolve(true);
        },
      });
    });
  }

  private showToast(message: string, type: 'danger' | 'loading') {
    this.toastService?.open({
      type,
      message: translate(message),
    });
  }
}
