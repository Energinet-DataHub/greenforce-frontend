import { Component, inject, input } from '@angular/core';
import {
  DownloadEsettExchangeEventsDocument,
  DownloadEsettExchangeEventsQueryVariables,
  ExchangeEventSortProperty,
  SortDirection,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { exportToCSVRaw } from '@energinet-datahub/dh/shared/ui-util';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { translate, TranslocoPipe } from '@ngneat/transloco';

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
