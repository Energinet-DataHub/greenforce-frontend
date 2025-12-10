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

import { translate } from '@jsverse/transloco';

import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';
import { DhDownloadButtonComponent, GenerateCSV } from '@energinet-datahub/dh/shared/ui-util';

import {
  DownloadEsettExchangeEventsDocument,
  DownloadEsettExchangeEventsQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-outgoing-message-download',
  imports: [DhDownloadButtonComponent],
  template: ` <dh-download-button (click)="download()" /> `,
})
export class DhOutgoingMessageDownloadComponent {
  private downloadMessagesQuery = lazyQuery(DownloadEsettExchangeEventsDocument);
  private generateCSV = GenerateCSV.fromQueryWithRawResult(
    this.downloadMessagesQuery,
    (x) => x.downloadEsettExchangeEvents
  );

  variables = input.required<Partial<DownloadEsettExchangeEventsQueryVariables> | undefined>();

  async download() {
    await this.generateCSV
      .addVariables({
        ...this.variables,
        locale: translate('selectedLanguageIso'),
      })
      .generate('eSett.outgoingMessages.fileName');
  }
}
