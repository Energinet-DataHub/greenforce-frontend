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
import { Component, effect, inject, input } from '@angular/core';

import { WattSpinnerComponent } from '@energinet/watt/spinner';
import { VaterFlexComponent, VaterStackComponent } from '@energinet/watt/vater';
import { WattIconComponent } from '@energinet/watt/icon';

import { DhCertificateUploaderComponent } from './certificate/dh-certificate-uploader.component';
import { DhCertificateViewComponent } from './certificate/dh-certificate-view.component';
import { DhGenerateClientSecretComponent } from './client-secret/dh-generate-client-secret.component';
import { DhClientSecretViewComponent } from './client-secret/dh-client-secret-view.component';
import { WattEmptyStateNoResultsComponent } from '@energinet/watt/empty-state';

import { DhMarketPartyB2BAccessStore } from './dh-b2b-access.store';
@Component({
  selector: 'dh-b2b-access-tab',
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
          <dh-certificate-view [marketParticipantId]="marketParticipantId()" />
        }

        @if (doesClientSecretMetadataExist()) {
          <dh-client-secret-view [marketParticipantId]="marketParticipantId()" />
        }
      } @else {
        <vater-stack justify="center" gap="l">
          <watt-icon size="xxl">
            <watt-empty-state-no-results />
          </watt-icon>
          <vater-stack direction="row" justify="center" gap="m">
            <dh-certificate-uploader [marketParticipantId]="marketParticipantId()" />
            <dh-generate-client-secret [marketParticipantId]="marketParticipantId()" />
          </vater-stack>
        </vater-stack>
      }
    }
  `,
  viewProviders: [DhMarketPartyB2BAccessStore],
  imports: [
    VaterStackComponent,
    VaterFlexComponent,
    WattSpinnerComponent,
    WattIconComponent,
    WattEmptyStateNoResultsComponent,
    DhCertificateViewComponent,
    DhCertificateUploaderComponent,
    DhGenerateClientSecretComponent,
    DhClientSecretViewComponent,
  ],
})
export class DhB2bAccessTabComponent {
  private readonly store = inject(DhMarketPartyB2BAccessStore);

  doCredentialsExist = this.store.doCredentialsExist;
  doesCertificateExist = this.store.doesCertificateExist;
  doesClientSecretMetadataExist = this.store.doesClientSecretMetadataExist;

  showSpinner = this.store.showSpinner;

  marketParticipantId = input.required<string>();

  constructor() {
    effect(() => {
      this.store.resetClientSecret();
      this.store.getCredentials(this.marketParticipantId());
    });
  }
}
