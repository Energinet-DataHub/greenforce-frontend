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
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattToastService } from '@energinet-datahub/watt/toast';
import {
  ApiErrorCollection,
  readApiErrorResponse,
} from '@energinet-datahub/dh/market-participant/data-access-api';
import { DhImbalancePricesDataAccessApiStore } from '@energinet-datahub/dh/imbalance-prices/data-access-api';

const csvExt = '.csv';
const csvMimeTypes = ['text/csv', 'application/vnd.ms-excel'];

@Component({
  selector: 'dh-imbalance-prices-uploader',
  standalone: true,
  styles: [
    `
      :host {
        display: block;
      }

      .upload-input {
        display: none;
      }
    `,
  ],
  template: `<input
      type="file"
      class="upload-input"
      [accept]="csvExt"
      (change)="onFileSelected(fileUpload.files)"
      #fileUpload
    />

    <watt-button
      icon="upload"
      variant="secondary"
      [loading]="uploadInProgress()"
      (click)="fileUpload.click()"
    >
      {{ 'imbalancePrices.uploadButton' | transloco }}
    </watt-button>`,
  providers: [DhImbalancePricesDataAccessApiStore],
  imports: [TranslocoPipe, WattButtonComponent],
})
export class DhImbalancePricesUploaderComponent {
  private readonly store = inject(DhImbalancePricesDataAccessApiStore);
  private readonly toastService = inject(WattToastService);
  private readonly transloco = inject(TranslocoService);

  csvExt = csvExt;

  uploadInProgress = toSignal(this.store.uploadInProgress$, { requireSync: true });

  @Output() uploadSuccess = new EventEmitter<void>();

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
    return csvMimeTypes.includes(file.type);
  }

  private startUpload(file: File): void {
    this.store.uploadCSV({
      file,
      onSuccess: this.onUploadSuccessFn,
      onError: this.onUploadErrorFn,
    });
  }

  private onUploadSuccessFn = () => {
    const message = this.transloco.translate('imbalancePrices.uploadSuccess');

    this.toastService.open({ type: 'success', message });

    this.uploadSuccess.emit();
  };

  private onUploadErrorFn = (apiErrorCollection: ApiErrorCollection) => {
    const message =
      apiErrorCollection.apiErrors.length > 0
        ? readApiErrorResponse([apiErrorCollection])
        : this.transloco.translate('imbalancePrices.uploadError');

    this.toastService.open({ type: 'danger', message });
  };
}
