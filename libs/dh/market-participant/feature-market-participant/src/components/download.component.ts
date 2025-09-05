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

import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { GenerateCSV } from '@energinet-datahub/dh/shared/ui-util';
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
  private generateCSV = GenerateCSV.fromQuery(
    this.query,
    (x) => x.paginatedMarketParticipants?.nodes ?? []
  );

  variables = input<Variables>();

  async download() {
    const marketParticipantsPath = 'marketParticipant.actorsOverview';

    this.generateCSV
      .addVariables({
        ...this.variables(),
        first: 10_000,
      })
      .addHeaders([
        `"ID"`,
        `"${translate(marketParticipantsPath + '.columns.glnOrEic')}"`,
        `"${translate(marketParticipantsPath + '.columns.name')}"`,
        `"${translate(marketParticipantsPath + '.columns.marketRole')}"`,
        `"${translate(marketParticipantsPath + '.columns.status')}"`,
        `"${translate(marketParticipantsPath + '.columns.mail')}"`,
      ])
      .mapLines((marketParticipants) =>
        marketParticipants.map((marketParticipant) => [
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
        ])
      )
      .generate(`${marketParticipantsPath}.fileName`);
  }
}
