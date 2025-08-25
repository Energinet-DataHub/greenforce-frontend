import { Component, input } from '@angular/core';
import { translate, TranslocoPipe } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { exportToCSV } from '@energinet-datahub/dh/shared/ui-util';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { GetPaginatedMarketParticipantsDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { Variables } from '../types';

@Component({
  imports: [WattButtonComponent, TranslocoPipe],
  selector: 'dh-download-market-participants',
  template: ` <watt-button icon="download" variant="text" (click)="download()">{{
    'shared.download' | transloco
  }}</watt-button>`,
})
export class DownloadMarketParticipants {
  private query = lazyQuery(GetPaginatedMarketParticipantsDocument);

  variables = input<Variables>();

  async download() {
    const result = await this.query.query({
      variables: {
        ...this.variables(),
        first: 10_000,
      },
    });

    const marketParticipants = result.data?.paginatedMarketParticipants?.nodes ?? [];

    const marketParticipantsPath = 'marketParticipant.actorsOverview';

    const headers = [
      `"ID"`,
      `"${translate(marketParticipantsPath + '.columns.glnOrEic')}"`,
      `"${translate(marketParticipantsPath + '.columns.name')}"`,
      `"${translate(marketParticipantsPath + '.columns.marketRole')}"`,
      `"${translate(marketParticipantsPath + '.columns.status')}"`,
      `"${translate(marketParticipantsPath + '.columns.mail')}"`,
    ];

    const lines = marketParticipants.map((marketParticipant) => [
      `"${marketParticipant.id}"`,
      `"""${marketParticipant.glnOrEicNumber}"""`,
      `"${marketParticipant.name}"`,
      `"${
        marketParticipant.marketRole == null
          ? ''
          : translate('marketParticipant.marketRoles.' + marketParticipant.marketRole)
      }"`,
      `"${marketParticipant.status == null ? '' : translate('marketParticipant.status.' + marketParticipant.status)}"`,
      `"${marketParticipant.publicMail?.mail ?? ''}"`,
    ]);

    exportToCSV({ headers, lines, fileName: 'DataHub-Market Participants' });
  }
}
