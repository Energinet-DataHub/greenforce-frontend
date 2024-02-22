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

import { TranslocoDirective } from '@ngneat/transloco';

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

import { DhMeteringGridAreaImbalance } from '../dh-metering-gridarea-imbalance';
import {
  DhDrawerImbalanceTableComponent,
  MeteringGridAreaImbalancePerDayDtoExtended,
} from './dh-drawer-imbalance-table.component';
import { WattTableDataSource } from '@energinet-datahub/watt/table';

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
    `,
  ],
  imports: [
    TranslocoDirective,
    RxPush,

    WATT_DRAWER,
    WATT_TABS,
    WATT_EXPANDABLE_CARD_COMPONENTS,

    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattDatePipe,
    WattCodeComponent,

    VaterFlexComponent,

    DhEmDashFallbackPipe,
    DhDrawerImbalanceTableComponent,
  ],
})
export class DhMeteringGridAreaImbalanceDrawerComponent {
  private readonly _esettHttp = inject(EsettExchangeHttp);
  private _getDocument$ = new Subject<string>();

  surplusDataSource = new WattTableDataSource<MeteringGridAreaImbalancePerDayDtoExtended>();
  deficitDataSource = new WattTableDataSource<MeteringGridAreaImbalancePerDayDtoExtended>();

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

    const imbalances = message.imbalancePerDay.map((x, index) => ({
      outgoingQuantity: x.outgoingQuantity ?? 0,
      incomingQuantity: x.incomingQuantity ?? 0,
      imbalanceDay: x.imbalanceDay,
      time: x.imbalanceDay,
      position: index,
      __typename: x.__typename,
    }));

    //Alle underskud og overskud ud. Hvis positionen for den første værdi der ikke er 0.

    const surplus = imbalances.filter((x) => x.incomingQuantity > 0);
    const deficit = imbalances.filter((x) => x.outgoingQuantity > 0);

    this.surplusDataSource.data = surplus;
    this.deficitDataSource.data = deficit;

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
}
