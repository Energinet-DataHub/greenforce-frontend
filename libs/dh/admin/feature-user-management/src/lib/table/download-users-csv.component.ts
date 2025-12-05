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

import { translate } from '@jsverse/transloco';

import { wattFormatDate } from '@energinet/watt/date';

import {
  GetUsersForCsvDocument,
  GetUsersForCsvQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhDownloadButtonComponent, GenerateCSV } from '@energinet-datahub/dh/shared/ui-util';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { DhApplicationInsights } from '@energinet-datahub/dh/shared/util-application-insights';

type Variables = Partial<GetUsersForCsvQueryVariables>;

@Component({
  selector: 'dh-download-users-csv',
  imports: [DhDownloadButtonComponent],
  template: ` <dh-download-button (clicked)="download()" [loading]="query.loading()" /> `,
})
export class DhDownloadUsersCsvComponent {
  private readonly appInsights = inject(DhApplicationInsights);

  query = lazyQuery(GetUsersForCsvDocument);
  private generateCsv = GenerateCSV.fromQuery(this.query, (result) => result.users?.items || []);

  variables = input<Variables>();

  async download() {
    this.appInsights.trackEvent('Button: Download users');
    const basePath = 'admin.userManagement.downloadUsers';

    this.generateCsv
      .addVariables({
        ...this.variables(),
        take: 10_000,
      })
      .addHeaders([
        `"${translate(basePath + '.userName')}"`,
        `"${translate(basePath + '.email')}"`,
        `"${translate(basePath + '.marketParticipantName')}"`,
        `"${translate(basePath + '.latestLogin')}"`,
        `"${translate(basePath + '.organisationName')}"`,
      ])
      .mapLines((users) =>
        users.map((user) => [
          `"${user.name}"`,
          `"${user.email}"`,
          `"${user.administratedByName}"`,
          `"${(user.latestLoginAt && wattFormatDate(user.latestLoginAt, 'short')) || ''}"`,
          `"${user.administratedByOrganizationName}"`,
        ])
      )
      .generate(`${basePath}.fileName`);
  }
}
