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
import { Component, Input, OnChanges, inject, signal } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { NgIf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';
import { DhMarketParticipantCertificateStore } from '@energinet-datahub/dh/market-participant/actors/data-access-api';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattToastService } from '@energinet-datahub/watt/toast';

const certificateExt = '.cer';
const certificateMimeType = 'application/x-x509-ca-cert';

@Component({
  selector: 'dh-certificate',
  standalone: true,
  styles: [
    `
      :host {
        display: block;
      }

      .certificate-input {
        display: none;
      }
    `,
  ],
  template: `
    <ng-container
      *transloco="let t; read: 'marketParticipant.actorsOverview.drawer.tabs.certificate'"
    >
      <input
        type="file"
        class="certificate-input"
        [accept]="certificateExt"
        (change)="onFileSelected(fileUpload.files)"
        #fileUpload
      />

      <vater-flex gap="m">
        <watt-validation-message
          *ngIf="isInvalidFileType()"
          type="warning"
          [message]="t('invalidFileType')"
        />

        <vater-flex
          direction="row"
          justify="center"
          *ngIf="loadingCredentials() || isUploadInProgress(); else componentContent"
        >
          <watt-spinner />
        </vater-flex>

        <ng-template #componentContent>
          <watt-card variant="solid" *ngIf="doCredentialsExist()">
            <watt-description-list variant="stack">
              <watt-description-list-item
                [label]="t('thumbprint')"
                [value]="certificateMetaData()?.thumbprint | dhEmDashFallback"
              />
              <watt-description-list-item
                [label]="t('expiryDate')"
                [value]="undefined | dhEmDashFallback"
              />
            </watt-description-list>
          </watt-card>

          <vater-stack direction="row" justify="flex-end" gap="m">
            <watt-button *ngIf="doCredentialsExist()">{{ t('removeCertificate') }}</watt-button>
            <watt-button (click)="fileUpload.click()">{{ t('uploadCertificate') }}</watt-button>
          </vater-stack>
        </ng-template>
      </vater-flex>
    </ng-container>
  `,
  imports: [
    NgIf,
    TranslocoDirective,

    WattButtonComponent,
    WATT_CARD,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    VaterFlexComponent,
    VaterStackComponent,
    WattValidationMessageComponent,
    WattSpinnerComponent,

    DhEmDashFallbackPipe,
  ],
  viewProviders: [DhMarketParticipantCertificateStore],
})
export class DhCertificateComponent implements OnChanges {
  private readonly store = inject(DhMarketParticipantCertificateStore);
  private readonly toastService = inject(WattToastService);
  private readonly transloco = inject(TranslocoService);

  certificateExt = certificateExt;

  isInvalidFileType = signal(false);

  doCredentialsExist = toSignal(this.store.doCredentialsExist$);
  certificateMetaData = toSignal(this.store.certificateMetaData$);

  loadingCredentials = toSignal(this.store.loadingCredentials$);
  isUploadInProgress = toSignal(this.store.uploadInProgress$);

  @Input({ required: true }) actorId = '';

  ngOnChanges(): void {
    this.store.getCredentials(this.actorId);
  }

  onFileSelected(files: FileList | null): void {
    if (files == null) {
      return;
    }

    const file = files[0];

    if (this.isValidFileType(file)) {
      this.isInvalidFileType.set(false);

      return this.startUpload(this.actorId, file);
    } else {
      this.isInvalidFileType.set(true);
    }
  }

  private startUpload(actorId: string, file: File): void {
    this.store.uploadCertificate({
      actorId,
      file,
      onSuccess: this.onUploadSuccessFn,
      onError: this.onUploadErrorFn,
    });
  }

  private isValidFileType(file: File): boolean {
    return file.type === certificateMimeType;
  }

  private readonly onUploadSuccessFn = () => {
    const message = this.transloco.translate(
      'marketParticipant.actorsOverview.drawer.tabs.certificate.uploadSuccess'
    );

    this.toastService.open({ type: 'success', message });

    this.store.getCredentials(this.actorId);
  };

  private readonly onUploadErrorFn = () => {
    const message = this.transloco.translate(
      'marketParticipant.actorsOverview.drawer.tabs.certificate.uploadError'
    );

    this.toastService.open({ type: 'danger', message });
  };
}
