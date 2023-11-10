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
import { Component, Input, OnChanges, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { DhMarketPartyCredentialsStore } from '@energinet-datahub/dh/market-participant/actors/data-access-api';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { DhCertificateUploaderComponent } from './dh-certificate-uploader.component';
import { DhCertificateComponent } from './dh-certificate.component';

@Component({
  selector: 'dh-b2b-access-tab',
  standalone: true,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `
    <vater-flex direction="row" justify="center" *ngIf="showSpinner(); else elseCase">
      <watt-spinner />
    </vater-flex>

    <ng-template #elseCase>
      <ng-container *ngIf="doCredentialsExist(); else emptyState">
        <ng-container *ngIf="doesCertificateExist()">
          <dh-certificate [actorId]="actorId" />
        </ng-container>

        <!-- If client secret exists -->
        <!-- Show client secret component -->
        <!-- Else show empty state -->
      </ng-container>

      <ng-template #emptyState>
        <vater-stack direction="row" justify="center">
          <dh-certificate-uploader [actorId]="actorId" />
        </vater-stack>
      </ng-template>
    </ng-template>
  `,
  viewProviders: [DhMarketPartyCredentialsStore],
  imports: [
    NgIf,
    VaterStackComponent,
    VaterFlexComponent,
    WattButtonComponent,
    WattSpinnerComponent,

    DhCertificateComponent,
    DhCertificateUploaderComponent,
  ],
})
export class DhB2bAccessTabComponent implements OnChanges {
  private readonly store = inject(DhMarketPartyCredentialsStore);

  doCredentialsExist = toSignal(this.store.doCredentialsExist$);
  doesCertificateExist = toSignal(this.store.doesCertificateExist$);

  loadingCredentials = toSignal(this.store.loadingCredentials$);
  isUploadInProgress = toSignal(this.store.uploadInProgress$);
  isRemoveInProgress = toSignal(this.store.removeInProgress$);

  showSpinner = computed(() => {
    return this.loadingCredentials() || this.isUploadInProgress() || this.isRemoveInProgress();
  });

  @Input({ required: true }) actorId = '';

  ngOnChanges(): void {
    this.store.getCredentials(this.actorId);
  }
}
