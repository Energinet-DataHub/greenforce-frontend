import { Component, inject, input } from '@angular/core';

import { translate, TranslocoPipe } from '@ngneat/transloco';

import { wattFormatDate } from '@energinet-datahub/watt/date';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import {
  GetUsersForCsvDocument,
  MarketParticipantSortDirctionType,
  UserOverviewSearchQueryVariables,
  UserOverviewSortProperty,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { exportToCSV } from '@energinet-datahub/dh/shared/ui-util';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { dhAppEnvironmentToken } from '@energinet-datahub/dh/shared/environments';

import type { ResultOf } from '@graphql-typed-document-node/core';

type CsvUser = NonNullable<CsvUsers>[0];
type Variables = Partial<UserOverviewSearchQueryVariables>;
type CsvUsers = NonNullable<ResultOf<typeof GetUsersForCsvDocument>['userOverviewSearch']>['nodes'];

@Component({
  standalone: true,
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
          first: 10_000,
          sortDirection: MarketParticipantSortDirctionType.Asc,
          sortProperty: UserOverviewSortProperty.FirstName,
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

      const lines = (result.data.userOverviewSearch?.nodes ?? []).map((x: CsvUser) => [
        `"${x.name}"`,
        `"${x.email}"`,
        `"${x.administratedBy?.name}"`,
        `"${(x.latestLoginAt && wattFormatDate(x.latestLoginAt, 'short')) || ''}"`,
        `"${x.administratedBy?.organization.name}"`,
      ]);

      const fileName = translate(`${basePath}.fileName`, {
        datetime: wattFormatDate(new Date(), 'long'),
        env: translate(`envinronementName.${this.environment.current}`),
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
