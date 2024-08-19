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

import { HttpClient } from '@angular/common/http';
import { Component, inject, viewChild, output, signal } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';
import { outputToObservable } from '@angular/core/rxjs-interop';

import { RxPush } from '@rx-angular/template/push';
import { switchMap } from 'rxjs';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import { WattDatePipe } from '@energinet-datahub/watt/utils/date';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattCodeComponent } from '@energinet-datahub/watt/code';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';

import { DhEmDashFallbackPipe, streamToFile } from '@energinet-datahub/dh/shared/ui-util';

import {
  DhMeteringGridAreaImbalance,
  MeteringGridAreaImbalancePerDayDto,
} from '../dh-metering-gridarea-imbalance';
import { DhDrawerImbalanceTableComponent } from './dh-drawer-imbalance-table.component';

@Component({
  selector: 'dh-metering-grid-imbalance-drawer',
  standalone: true,
  templateUrl: './dh-drawer.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      .message-heading {
        margin: 0;
        margin-bottom: var(--watt-space-s);
      }

      .xml-message-container {
        padding: var(--watt-space-ml);
      }

      watt-button {
        margin-left: auto;
      }
    `,
  ],
  imports: [
    RxPush,
    TranslocoPipe,
    TranslocoDirective,

    WATT_TABS,
    WATT_DRAWER,
    WATT_EXPANDABLE_CARD_COMPONENTS,

    WattDatePipe,
    WattCodeComponent,
    WattSpinnerComponent,
    WattButtonComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,

    VaterFlexComponent,

    DhEmDashFallbackPipe,
    DhDrawerImbalanceTableComponent,
  ],
})
export class DhMeteringGridAreaImbalanceDrawerComponent {
  private _toastService = inject(WattToastService);
  private readonly httpClient = inject(HttpClient);

  surplusDataSource = new WattTableDataSource<MeteringGridAreaImbalancePerDayDto>();
  deficitDataSource = new WattTableDataSource<MeteringGridAreaImbalancePerDayDto>();

  meteringGridAreaImbalance: DhMeteringGridAreaImbalance | null = null;

  xmlMessage = signal<string | undefined>(undefined);

  drawer = viewChild.required(WattDrawerComponent);
  closed = output<void>();
  closed$ = outputToObservable(this.closed);

  public open(message: DhMeteringGridAreaImbalance): void {
    this.drawer().open();

    this.meteringGridAreaImbalance = message;
    this.surplusDataSource.data = message.incomingImbalancePerDay;
    this.deficitDataSource.data = message.outgoingImbalancePerDay;

    this.loadDocument(message.mgaImbalanceDocumentUrl, this.xmlMessage.set);
  }

  onClose(): void {
    this.closed.emit();
  }

  private loadDocument(url: string | null | undefined, setDocument: (doc: string) => void) {
    if (!url) return;
    this.httpClient.get(url, { responseType: 'text' }).subscribe(setDocument);
  }

  downloadCSV(url: string | undefined | null): void {
    if (!url) return;

    this._toastService.open({
      type: 'loading',
      message: translate('shared.downloadStart'),
    });

    const fileOptions = {
      name: 'mga-' + url,
      type: 'text/xml',
    };

    this.httpClient
      .get(url, { responseType: 'text' })
      .pipe(switchMap(streamToFile(fileOptions)))
      .subscribe({
        complete: () => this._toastService.dismiss(),
        error: () => {
          this._toastService.open({
            type: 'danger',
            message: translate('shared.downloadFailed'),
          });
        },
      });
  }
}
