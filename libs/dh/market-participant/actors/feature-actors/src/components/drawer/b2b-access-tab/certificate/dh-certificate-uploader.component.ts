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
import { Component, input, inject, output } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { DhMarketPartyB2BAccessStore } from '@energinet-datahub/dh/market-participant/actors/data-access-api';

import { DhActorAuditLogService } from '../../dh-actor-audit-log.service';
import {
  ApiErrorCollection,
  readApiErrorResponse,
} from '@energinet-datahub/dh/market-participant/data-access-api';

const certificateExt = '.cer';
const certificateMimeType = 'application/x-x509-ca-cert';

@Component({
  selector: 'dh-certificate-uploader',
  styles: [
    `
      :host {
        display: block;
      }

      .upload-certificate-input {
        display: none;
      }
    `,
  ],
  template: `<input
      type="file"
      class="upload-certificate-input"
      [accept]="certificateExt"
      (change)="onFileSelected(fileUpload.files)"
      #fileUpload
    />

    <watt-button
      *transloco="let t; read: 'marketParticipant.actorsOverview.drawer.tabs.b2bAccess'"
      variant="secondary"
      [loading]="uploadInProgress()"
      (click)="fileUpload.click()"
    >
      {{ doesCertificateExist() ? t('uploadNewCertificate') : t('uploadCertificate') }}
    </watt-button>`,
  imports: [TranslocoDirective, WattButtonComponent],
})
export class DhCertificateUploaderComponent {
  private readonly store = inject(DhMarketPartyB2BAccessStore);
  private readonly toastService = inject(WattToastService);
  private readonly transloco = inject(TranslocoService);
  private readonly auditLogService = inject(DhActorAuditLogService);

  certificateExt = certificateExt;

  doesCertificateExist = this.store.doesCertificateExist;
  doesClientSecretMetadataExist = this.store.doesClientSecretMetadataExist;
  uploadInProgress = this.store.uploadInProgress;

  actorId = input.required<string>();

  uploadSuccess = output<void>();

  onFileSelected(files: FileList | null): void {
    if (files == null) {
      return;
    }

    const file = files[0];

    if (this.isValidFileType(file)) {
      return this.startUpload(file);
    }
  }

  private isValidFileType(file: File): boolean {
    return file.type === certificateMimeType;
  }

  private startUpload(file: File): void {
    if (this.doesCertificateExist() || this.doesClientSecretMetadataExist()) {
      this.store.replaceCertificate({
        file,
        onSuccess: this.onUploadSuccessFn,
        onError: this.onUploadErrorFn,
      });
    } else {
      this.store.uploadCertificate({
        file,
        onSuccess: this.onUploadSuccessFn,
        onError: this.onUploadErrorFn,
      });
    }
  }

  private onUploadSuccessFn = () => {
    const message = this.transloco.translate(
      'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.uploadSuccess'
    );

    this.toastService.open({ type: 'success', message });

    this.uploadSuccess.emit();
    this.store.getCredentials(this.actorId());
    this.auditLogService.refreshAuditLog(this.actorId());
  };

  private onUploadErrorFn = (apiErrorCollection: ApiErrorCollection) => {
    const message =
      apiErrorCollection.apiErrors.length > 0
        ? readApiErrorResponse([apiErrorCollection])
        : this.transloco.translate(
            'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.uploadError'
          );

    this.toastService.open({ type: 'danger', message });
  };
}
