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
import { Component, input } from '@angular/core';

import { translate, TranslocoPipe } from '@jsverse/transloco';

import { wattFormatDate } from '@energinet/watt/date';
import { WattButtonComponent } from '@energinet/watt/button';

import {
  GetUsersForCsvDocument,
  GetUsersForCsvQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { GenerateCSV } from '@energinet-datahub/dh/shared/ui-util';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

type Variables = Partial<GetUsersForCsvQueryVariables>;

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
  query = lazyQuery(GetUsersForCsvDocument);
  private generateCsv = GenerateCSV.fromQuery(this.query, (result) => result.usersForCsvExport || []);

  variables = input<Variables>();

  async download() {
    const basePath = 'admin.userManagement.downloadUsers';

    this.generateCsv
      .addVariables({
        ...this.variables(),
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
          `"${user.actorName}"`,
          `"${(user.latestLoginAt && wattFormatDate(user.latestLoginAt, 'short')) || ''}"`,
          `"${user.organizationName}"`,
        ])
      )
      .generate(`${basePath}.fileName`);
  }
}
