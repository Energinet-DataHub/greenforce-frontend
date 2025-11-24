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

import { take } from 'rxjs';
import { translate, TranslocoService } from '@jsverse/transloco';

import { DhDownloadButtonComponent, GenerateCSV } from '@energinet-datahub/dh/shared/ui-util';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

import {
  GetUserRolesForCsvDocument,
  GetUserRolesForCsvQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';

type Variables = Partial<GetUserRolesForCsvQueryVariables>;

@Component({
  selector: 'dh-user-roles-download',
  imports: [DhDownloadButtonComponent],
  template: ` <dh-download-button (clicked)="download()" />`,
})
export class DhUserRolesDownloadComponent {
  private transloco = inject(TranslocoService);
  private query = lazyQuery(GetUserRolesForCsvDocument);
  private generateCSV = GenerateCSV.fromQuery(this.query, (x) => x.filteredUserRoles?.nodes ?? []);

  variables = input<Variables>();

  async download() {
    this.transloco
      .selectTranslateObject('marketParticipant.marketRoles')
      .pipe(take(1))
      .subscribe((rolesTranslations) => {
        const basePath = 'admin.userManagement.tabs.roles.table.columns.';

        this.generateCSV
          .addVariables({
            ...this.variables(),
            first: 10_000,
          })
          .addHeaders([
            `"${translate(basePath + 'name')}"`,
            `"${translate(basePath + 'marketRole')}"`,
            `"${translate(basePath + 'status')}"`,
          ])
          .mapLines((result) =>
            result.map((role) => [
              `"${role.name}"`,
              `"${rolesTranslations[role.eicFunction]}"`,
              `"${translate('admin.userManagement.roleStatus.' + role.status)}"`,
            ])
          )
          .generate('admin.userManagement.tabs.roles.download.fileName');
      });
  }
}
