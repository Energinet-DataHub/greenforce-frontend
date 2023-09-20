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
import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { RxPush } from '@rx-angular/template/push';
import { tap } from 'rxjs';

import { WattCardComponent } from '@energinet-datahub/watt/card';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';

import { EoPopupMessageComponent } from '@energinet-datahub/eo/shared/atomic-design/feature-molecules';
import { EoTransfersStore } from './eo-transfers.store';
import { EoTransfersTableComponent } from './eo-transfers-table.component';
import { EoBetaMessageComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { EoTransfersService } from './eo-transfers.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-transfers',
  imports: [
    WattCardComponent,
    EoTransfersTableComponent,
    EoPopupMessageComponent,
    NgIf,
    RxPush,
    EoBetaMessageComponent,
    WattIconComponent,
    VaterStackComponent,
  ],
  standalone: true,
  template: `
    <eo-popup-message *ngIf="error$ | push"></eo-popup-message>
    <eo-eo-beta-message></eo-eo-beta-message>
    <watt-card class="watt-space-stack-m">
      <eo-transfers-table
        [transfers]="transfers$ | push"
        [loading]="loading$ | push"
        [selectedTransfer]="selectedTransfer$ | push"
        (transferSelected)="store.setSelectedTransfer($event)"
      ></eo-transfers-table>
    </watt-card>

    <vater-stack *ngIf="showAutomationError() && (transfers$ | push).length > 0">
      <p style="display: flex; gap: var(--watt-space-xs);">
        <watt-icon name="warning" fill />We are currently experiencing an issue handling
        certificates<br />
      </p>
      <small>Once we resolve the issue, the outstanding transfers will update automatically.</small>
    </vater-stack>
  `,
})
export class EoTransfersComponent implements OnInit {
  protected store = inject(EoTransfersStore);
  protected showAutomationError = signal<boolean>(false);
  private transfersService = inject(EoTransfersService);
  private cd = inject(ChangeDetectorRef);

  error$ = this.store.error$;
  loading$ = this.store.loadingTransferAgreements$.pipe(
    tap(() => {
      this.cd.detectChanges();
    })
  );
  transfers$ = this.store.transfers$;
  selectedTransfer$ = this.store.selectedTransfer$;

  ngOnInit(): void {
    this.store.getTransfers();
    this.setShowAutomationError();
  }

  private setShowAutomationError() {
    this.transfersService.transferAutomationHasError().subscribe({
      next: (x) => {
        x ? this.showAutomationError.set(true) : this.showAutomationError.set(false);
      },
      error: () => this.showAutomationError.set(true),
    });
  }
}
