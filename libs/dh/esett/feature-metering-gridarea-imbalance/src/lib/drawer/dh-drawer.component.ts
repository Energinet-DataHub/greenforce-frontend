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

import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';

import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Component, ViewChild, Output, EventEmitter, inject, Signal } from '@angular/core';

import { RxPush } from '@rx-angular/template/push';
import { Observable, Subject, switchMap, takeUntil } from 'rxjs';

import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattCodeComponent } from '@energinet-datahub/watt/code';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { EsettExchangeHttp } from '@energinet-datahub/dh/shared/domain';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';

import {
  DhMeteringGridAreaImbalance,
  MeteringGridAreaImbalancePerDayDto,
} from '../dh-metering-gridarea-imbalance';
import { DhDrawerImbalanceTableComponent } from './dh-drawer-imbalance-table.component';
import { WattTableDataSource } from '@energinet-datahub/watt/table';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { streamToFile } from '@energinet-datahub/dh/wholesale/domain';

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
    TranslocoDirective,
    TranslocoPipe,
    RxPush,

    WATT_DRAWER,
    WATT_TABS,
    WATT_EXPANDABLE_CARD_COMPONENTS,

    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattDatePipe,
    WattCodeComponent,
    WattSpinnerComponent,
    WattButtonComponent,

    VaterFlexComponent,

    DhEmDashFallbackPipe,
    DhDrawerImbalanceTableComponent,
  ],
})
export class DhMeteringGridAreaImbalanceDrawerComponent {
  private readonly _esettHttp = inject(EsettExchangeHttp);
  private _getDocument$ = new Subject<string>();
  private _toastService = inject(WattToastService);

  surplusDataSource = new WattTableDataSource<MeteringGridAreaImbalancePerDayDto>();
  deficitDataSource = new WattTableDataSource<MeteringGridAreaImbalancePerDayDto>();

  xmlMessage: Signal<string | undefined> = toSignal(
    this._getDocument$.pipe(
      switchMap((documentLink) => this.loadDocument(documentLink)),
      takeUntilDestroyed()
    )
  );

  meteringGridAreaImbalance: DhMeteringGridAreaImbalance | null = null;

  @ViewChild(WattDrawerComponent)
  drawer: WattDrawerComponent | undefined;

  @Output() closed = new EventEmitter<void>();

  public open(message: DhMeteringGridAreaImbalance): void {
    this.drawer?.open();

    this.meteringGridAreaImbalance = message;
    this.surplusDataSource.data = message.incomingImbalancePerDay;
    this.deficitDataSource.data = message.outgoingImbalancePerDay;

    if (message !== null && message.id) {
      this._getDocument$.next(message.id);
    }
  }

  onClose(): void {
    this.closed.emit();
  }

  private loadDocument(documentLink: string): Observable<string> {
    return this._esettHttp.v1EsettExchangeMgaImbalanceDocumentGet(documentLink).pipe(
      switchMap((res) => {
        const blobPart = res as unknown as BlobPart;
        const blob = new Blob([blobPart]);
        return new Response(blob).text();
      }),
      takeUntil(this.closed)
    );
  }

  downloadCSV(documentLink: string) {
    this._toastService.open({
      type: 'loading',
      message: translate('shared.downloadStart'),
    });

    const fileOptions = {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      name: 'mga-' + this.meteringGridAreaImbalance!.id,
      type: 'text/xml',
    };

    this._esettHttp
      .v1EsettExchangeMgaImbalanceDocumentGet(documentLink)
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
