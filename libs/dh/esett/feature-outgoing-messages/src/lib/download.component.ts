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

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { exportToCSVRaw } from '@energinet-datahub/dh/shared/ui-util';

import {
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

  variables = input.required<Partial<DownloadEsettExchangeEventsQueryVariables> | undefined>();

  async download() {
    this.toastService.open({
      type: 'loading',
      message: translate('shared.downloadStart'),
    });

    const variables = this.variables();

    if (!variables) {
      this.toastService.open({
        type: 'danger',
        message: translate('shared.downloadFailed'),
      });
      return;
    }

    try {
      const result = (
        await this.downloadMessagesQuery.query({
          variables: {
            ...variables,
            locale: translate('selectedLanguageIso'),
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
