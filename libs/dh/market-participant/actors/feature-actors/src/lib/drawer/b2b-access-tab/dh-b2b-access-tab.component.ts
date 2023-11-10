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
import { JsonPipe, NgIf } from '@angular/common';
import { Component, Input, OnChanges, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { DhMarketPartyCredentialsStore } from '@energinet-datahub/dh/market-participant/actors/data-access-api';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { DhCertificateUploaderComponent } from './dh-certificate-uploader.component';
import { DhCreateSecretComponent } from './dh-create-secret.component';
import { DhCertificateComponent } from './dh-certificate.component';
import { DhClientSecretViewComponent } from './dh-client-secret-view.component';

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

        <ng-container *ngIf="doesClientSecretMetadataExist()">
          <dh-client-secret-view [actorId]="actorId" />
        </ng-container>
      </ng-container>

      <ng-template #emptyState>
        <vater-stack direction="row" justify="center" gap="m">
          <dh-certificate-uploader [actorId]="actorId" />
          <dh-create-secret [actorId]="actorId" />
        </vater-stack>
      </ng-template>
    </ng-template>
  `,
  viewProviders: [DhMarketPartyCredentialsStore],
  imports: [
    NgIf,
    JsonPipe,
    VaterStackComponent,
    VaterFlexComponent,
    WattButtonComponent,
    WattSpinnerComponent,

    DhCertificateComponent,
    DhCertificateUploaderComponent,
    DhCreateSecretComponent,
    DhClientSecretViewComponent,
  ],
})
export class DhB2bAccessTabComponent implements OnChanges {
  private readonly store = inject(DhMarketPartyCredentialsStore);

  doCredentialsExist = toSignal(this.store.doCredentialsExist$);
  doesCertificateExist = toSignal(this.store.doesCertificateExist$);
  doesClientSecretMetadataExist = toSignal(this.store.doesClientSecretMetadataExist$);

  showSpinner = toSignal(this.store.showSpinner$);

  @Input({ required: true }) actorId = '';

  ngOnChanges(): void {
    this.store.getCredentials(this.actorId);
  }
}
