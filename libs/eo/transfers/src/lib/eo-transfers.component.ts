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
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RxPush } from '@rx-angular/template/push';

import { EoPopupMessageComponent } from '@energinet-datahub/eo/shared/atomic-design/feature-molecules';
import { EoTransfersStore } from './eo-transfers.store';
import { EoTransfersTableComponent } from './eo-transfers-table.component';
import { WattCardComponent } from '@energinet-datahub/watt/card';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-transfers',
  imports: [WattCardComponent, EoTransfersTableComponent, EoPopupMessageComponent, NgIf, RxPush],
  standalone: true,
  template: `
    <eo-popup-message *ngIf="error$ | push"></eo-popup-message>
    <watt-card class="watt-space-stack-l">
      <h3 class="watt-space-stack-m">Welcome to the beta test of Energy Origin</h3>
      <h4 class="watt-space-stack-m">Notice of change:</h4>
      <p class="watt-space-stack-m">
        Due to changes in the solution regarding certificates, some data has been removed or is
        planned to be removed. <br />
        This means that metering points that have been activated for issuance of certificates before
        August 17th, 2023, must be re-activated. Furthermore, certificates that have been issued
        before August 23rd, 2023, will be removed. <br />
        <br />
        This page is based on real data and is working towards the coming solution regarding
        certificates. So it is not just a test, though these data cannot yet be used in a legal
        sense. It will be communicated, when it is out of beta and can be used legally. So you can
        try this without any consequences.
      </p>
    </watt-card>
    <watt-card class="watt-space-stack-m">
      <eo-transfers-table
        [transfers]="transfers$ | push"
        [loading]="loading$ | push"
        [selectedTransfer]="selectedTransfer$ | push"
        (transferSelected)="store.setSelectedTransfer($event)"
      ></eo-transfers-table>
    </watt-card>
  `,
})
export class EoTransfersComponent implements OnInit {
  protected store = inject(EoTransfersStore);

  error$ = this.store.error$;
  loading$ = this.store.loadingTransferAgreements$;
  transfers$ = this.store.transfers$;
  selectedTransfer$ = this.store.selectedTransfer$;

  ngOnInit(): void {
    this.store.getTransfers();
  }
}
