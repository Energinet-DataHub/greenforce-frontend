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
import { HttpClient, httpResource } from '@angular/common/http';
import { Component, inject, input, computed } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, translate } from '@jsverse/transloco';

import { tap } from 'rxjs';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WATT_DRAWER } from '@energinet-datahub/watt/drawer';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattCodeComponent } from '@energinet-datahub/watt/code';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { DhEmDashFallbackPipe, toFile } from '@energinet-datahub/dh/shared/ui-util';
import { GetMeteringGridAreaImbalanceByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhDrawerImbalanceTableComponent } from './imbalances.component';

@Component({
  selector: 'dh-metering-grid-imbalance-details',
  templateUrl: './details.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      .message-heading {
        margin: 0;
        margin-bottom: var(--watt-space-s);
      }

      watt-button {
        margin-left: auto;
      }
    `,
  ],
  imports: [
    TranslocoPipe,
    TranslocoDirective,
    WATT_TABS,
    WATT_DRAWER,
    WattDatePipe,
    WattCodeComponent,
    WattButtonComponent,
    WattSpinnerComponent,
    WattDescriptionListComponent,
    WATT_EXPANDABLE_CARD_COMPONENTS,
    WattDescriptionListItemComponent,
    VaterFlexComponent,
    DhEmDashFallbackPipe,
    DhDrawerImbalanceTableComponent,
  ],
})
export class DhMeteringGridAreaImbalanceDetails {
  private navigation = inject(DhNavigationService);
  private toastService = inject(WattToastService);
  private httpClient = inject(HttpClient);
  query = query(GetMeteringGridAreaImbalanceByIdDocument, () => ({ variables: { id: this.id() } }));

  surplusDataSource = computed(
    () =>
      new WattTableDataSource(
        this.query.data()?.meteringGridAreaImbalanceById?.incomingImbalancePerDay ?? []
      )
  );
  deficitDataSource = computed(
    () =>
      new WattTableDataSource(
        this.query.data()?.meteringGridAreaImbalanceById?.outgoingImbalancePerDay ?? []
      )
  );

  meteringGridAreaImbalance = computed(() => this.query.data()?.meteringGridAreaImbalanceById);

  // Param
  id = input.required<string>();

  xmlMessage = httpResource.text(
    () => this.meteringGridAreaImbalance()?.mgaImbalanceDocumentUrl ?? undefined
  );

  onClose(): void {
    this.navigation.navigate('list');
  }

  download(url: string | undefined | null): void {
    if (!url) return;

    this.toastService.open({
      type: 'loading',
      message: translate('shared.downloadStart'),
    });

    const fileOptions = {
      name: 'mga-' + url,
      type: 'text/xml',
    };

    this.httpClient
      .get(url, { responseType: 'text' })
      .pipe(tap((data) => toFile({ data, ...fileOptions })))
      .subscribe({
        complete: () => this.toastService.dismiss(),
        error: () => {
          this.toastService.open({
            type: 'danger',
            message: translate('shared.downloadFailed'),
          });
        },
      });
  }
}
