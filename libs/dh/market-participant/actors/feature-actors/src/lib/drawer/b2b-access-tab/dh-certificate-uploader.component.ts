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
import { Component, Input, inject, signal } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { DhMarketParticipantCertificateStore } from '@energinet-datahub/dh/market-participant/actors/data-access-api';

const certificateExt = '.cer';
const certificateMimeType = 'application/x-x509-ca-cert';

@Component({
  selector: 'dh-certificate-uploader',
  standalone: true,
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
      (click)="fileUpload.click()"
    >
      {{ doesCertificateExist() ? t('uploadNewCertificate') : t('uploadCertificate') }}
    </watt-button>`,
  imports: [TranslocoDirective, WattButtonComponent],
})
export class DhCertificateUploaderComponent {
  private readonly store = inject(DhMarketParticipantCertificateStore);
  private readonly toastService = inject(WattToastService);
  private readonly transloco = inject(TranslocoService);

  certificateExt = certificateExt;

  isInvalidFileType = signal(false);
  doesCertificateExist = toSignal(this.store.doesCertificateExist$);

  @Input({ required: true }) actorId = '';

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

  private isValidFileType(file: File): boolean {
    return file.type === certificateMimeType;
  }

  private startUpload(actorId: string, file: File): void {
    if (this.doesCertificateExist()) {
      this.store.replaceCertificate({
        actorId,
        file,
        onSuccess: this.onUploadSuccessFn,
        onError: this.onUploadErrorFn,
      });
    } else {
      this.store.uploadCertificate({
        actorId,
        file,
        onSuccess: this.onUploadSuccessFn,
        onError: this.onUploadErrorFn,
      });
    }
  }

  private readonly onUploadSuccessFn = () => {
    const message = this.transloco.translate(
      'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.uploadSuccess'
    );

    this.toastService.open({ type: 'success', message });

    this.store.getCredentials(this.actorId);
  };

  private readonly onUploadErrorFn = () => {
    const message = this.transloco.translate(
      'marketParticipant.actorsOverview.drawer.tabs.b2bAccess.uploadError'
    );

    this.toastService.open({ type: 'danger', message });
  };
}
