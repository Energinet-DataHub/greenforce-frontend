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
import { Component, inject, input } from '@angular/core';

import { translate, TranslocoPipe } from '@jsverse/transloco';

import { wattFormatDate } from '@energinet-datahub/watt/date';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import {
  SortEnumType,
  GetUsersForCsvDocument,
  GetUsersForCsvQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { exportToCSV } from '@energinet-datahub/dh/shared/ui-util';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { dhAppEnvironmentToken } from '@energinet-datahub/dh/shared/environments';

import type { ResultOf } from '@graphql-typed-document-node/core';

type CsvUser = NonNullable<CsvUsers>[0];
type Variables = Partial<GetUsersForCsvQueryVariables>;
type CsvUsers = NonNullable<ResultOf<typeof GetUsersForCsvDocument>['users']>['items'];

@Component({
  selector: 'dh-download-users-csv',
  imports: [TranslocoPipe, WattButtonComponent],
  template: `
    <watt-button icon="download" variant="text" (click)="download()" [loading]="query.loading()">{{
      'shared.download' | transloco
    }}</watt-button>
  `,
})
export class DhDownloadUsersCsvComponent {
  private environment = inject(dhAppEnvironmentToken);
  private toastService = inject(WattToastService);
  query = lazyQuery(GetUsersForCsvDocument);

  filters = input.required<Variables>();

  async download() {
    this.toastService.open({
      type: 'loading',
      message: translate('shared.downloadStart'),
    });

    try {
      const result = await this.query.query({
        variables: {
          ...this.filters(),
          order: {
            name: SortEnumType.Asc,
          },
          skip: 0,
          take: 10_000,
        },
      });

      const basePath = 'admin.userManagement.downloadUsers';

      const headers = [
        `"${translate(basePath + '.userName')}"`,
        `"${translate(basePath + '.email')}"`,
        `"${translate(basePath + '.marketParticipantName')}"`,
        `"${translate(basePath + '.latestLogin')}"`,
        `"${translate(basePath + '.organisationName')}"`,
      ];

      const lines = (result.data.users?.items ?? []).map((x: CsvUser) => [
        `"${x.name}"`,
        `"${x.email}"`,
        `"${x.administratedBy?.name}"`,
        `"${(x.latestLoginAt && wattFormatDate(x.latestLoginAt, 'short')) || ''}"`,
        `"${x.administratedBy?.organization.name}"`,
      ]);

      const fileName = translate(`${basePath}.fileName`, {
        datetime: wattFormatDate(new Date(), 'long'),
        env: translate(`environmentName.${this.environment.current}`),
      });

      exportToCSV({
        headers,
        lines,
        fileName,
      });

      this.toastService.dismiss();
    } catch {
      this.toastService.open({
        type: 'danger',
        message: translate('shared.downloadFailed'),
      });
    }
  }
}
