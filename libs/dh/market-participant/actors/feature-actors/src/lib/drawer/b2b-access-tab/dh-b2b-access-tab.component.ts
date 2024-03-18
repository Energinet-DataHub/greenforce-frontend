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
import { Component, OnChanges, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { DhMarketPartyB2BAccessStore } from '@energinet-datahub/dh/market-participant/actors/data-access-api';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattIconComponent } from '@energinet-datahub/watt/icon';

import { DhCertificateUploaderComponent } from './certificate/dh-certificate-uploader.component';
import { DhCertificateViewComponent } from './certificate/dh-certificate-view.component';
import { DhGenerateClientSecretComponent } from './client-secret/dh-generate-client-secret.component';
import { DhClientSecretViewComponent } from './client-secret/dh-client-secret-view.component';

@Component({
  selector: 'dh-b2b-access-tab',
  standalone: true,
  styles: [
    `
      :host {
        display: block;
      }

      watt-icon {
        color: var(--watt-color-primary-dark);
      }
    `,
  ],
  template: `
    @if (showSpinner()) {
      <vater-flex direction="row" justify="center">
        <watt-spinner />
      </vater-flex>
    } @else {
      @if (doCredentialsExist()) {
        @if (doesCertificateExist()) {
          <dh-certificate-view [actorId]="actorId()" />
        }

        @if (doesClientSecretMetadataExist()) {
          <dh-client-secret-view [actorId]="actorId()" />
        }
      } @else {
        <vater-stack justify="center" gap="l">
          <watt-icon name="custom-no-results" size="xxl" />
          <vater-stack direction="row" justify="center" gap="m">
            <dh-certificate-uploader [actorId]="actorId()" />
            <dh-generate-client-secret [actorId]="actorId()" />
          </vater-stack>
        </vater-stack>
      }
    }
  `,
  viewProviders: [DhMarketPartyB2BAccessStore],
  imports: [
    VaterStackComponent,
    VaterFlexComponent,
    WattButtonComponent,
    WattSpinnerComponent,
    WattIconComponent,

    DhCertificateViewComponent,
    DhCertificateUploaderComponent,
    DhGenerateClientSecretComponent,
    DhClientSecretViewComponent,
  ],
})
export class DhB2bAccessTabComponent implements OnChanges {
  private readonly store = inject(DhMarketPartyB2BAccessStore);

  doCredentialsExist = toSignal(this.store.doCredentialsExist$);
  doesCertificateExist = toSignal(this.store.doesCertificateExist$);
  doesClientSecretMetadataExist = toSignal(this.store.doesClientSecretMetadataExist$);

  showSpinner = toSignal(this.store.showSpinner$);

  actorId = input.required<string>();

  ngOnChanges(): void {
    this.store.resetClientSecret();

    this.store.getCredentials(this.actorId());
  }
}
