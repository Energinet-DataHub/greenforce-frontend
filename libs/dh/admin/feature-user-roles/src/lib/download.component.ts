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
import { translate, TranslocoPipe, TranslocoService } from '@ngneat/transloco';

import { wattFormatDate } from '@energinet-datahub/watt/date';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { exportToCSV } from '@energinet-datahub/dh/shared/ui-util';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

import {
  SortEnumType,
  GetUserRolesForCsvDocument,
  GetUserRolesForCsvQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { dhAppEnvironmentToken } from '@energinet-datahub/dh/shared/environments';

type Variables = Partial<GetUserRolesForCsvQueryVariables>;

@Component({
  standalone: true,
  selector: 'dh-user-roles-download',
  imports: [WattButtonComponent, TranslocoPipe],
  template: ` <watt-button icon="download" variant="text" (click)="download()">{{
    'shared.download' | transloco
  }}</watt-button>`,
})
export class DhUserRolesDownloadComponent {
  private environment = inject(dhAppEnvironmentToken);
  private toastService = inject(WattToastService);
  private transloco = inject(TranslocoService);
  private query = lazyQuery(GetUserRolesForCsvDocument);

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
          first: 10_000,
          order: {
            name: SortEnumType.Asc,
          },
        },
      });

      const userRoles = result.data.filteredUserRoles?.nodes ?? [];

      this.transloco
        .selectTranslateObject('marketParticipant.marketRoles')
        .pipe(take(1))
        .subscribe((rolesTranslations) => {
          const basePath = 'admin.userManagement.tabs.roles.table.columns.';

          const headers = [
            `"${translate(basePath + 'name')}"`,
            `"${translate(basePath + 'marketRole')}"`,
            `"${translate(basePath + 'status')}"`,
          ];

          const lines = userRoles.map((role) => [
            `"${role.name}"`,
            `"${rolesTranslations[role.eicFunction]}"`,
            `"${translate('admin.userManagement.roleStatus.' + role.status)}"`,
          ]);
          const env = translate(`envinronementName.${this.environment.current}`);
          const fileName = `DataHub-User-roles-${wattFormatDate(new Date(), 'long')}-${env}`;

          exportToCSV({ headers, lines, fileName });
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
