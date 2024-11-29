import { Component, effect, inject, input } from '@angular/core';

import { DhMarketPartyB2BAccessStore } from '@energinet-datahub/dh/market-participant/actors/data-access-api';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
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
    WattSpinnerComponent,
    WattIconComponent,

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

  actorId = input.required<string>();

  constructor() {
    effect(
      () => {
        this.store.resetClientSecret();
        this.store.getCredentials(this.actorId());
      },
      { allowSignalWrites: true }
    );
  }
}
