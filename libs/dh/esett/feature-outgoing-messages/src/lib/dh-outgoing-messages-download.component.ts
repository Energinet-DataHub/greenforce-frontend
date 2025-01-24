import { Component, inject, input } from '@angular/core';

import { translate, TranslocoPipe } from '@ngneat/transloco';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { exportToCSVRaw } from '@energinet-datahub/dh/shared/ui-util';

import {
  SortDirection,
  ExchangeEventSortProperty,
  DownloadEsettExchangeEventsDocument,
  DownloadEsettExchangeEventsQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-outgoing-message-download',
  imports: [WattButtonComponent, TranslocoPipe],
  template: `
    <watt-button icon="download" variant="text" (click)="download()">{{
      'shared.download' | transloco
    }}</watt-button>
  `,
})
export class DhOutgoingMessageDownloadComponent {
  private toastService = inject(WattToastService);
  private downloadMessagesQuery = lazyQuery(DownloadEsettExchangeEventsDocument);

  variables = input.required<Partial<DownloadEsettExchangeEventsQueryVariables>>();

  async download() {
    this.toastService.open({
      type: 'loading',
      message: translate('shared.downloadStart'),
    });

    try {
      const result = (
        await this.downloadMessagesQuery.query({
          variables: {
            locale: translate('selectedLanguageIso'),
            sortProperty:
              this.variables().sortProperty ?? ExchangeEventSortProperty.CalculationType,
            sortDirection: this.variables().sortDirection ?? SortDirection.Descending,
            ...this.variables(),
          },
        })
      ).data.downloadEsettExchangeEvents;
      exportToCSVRaw({
        content: result ?? '',
        fileName: 'eSett-outgoing-messages',
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
