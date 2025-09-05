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
import { Component, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattToastService } from '@energinet-datahub/watt/toast';
import {
  ApiErrorCollection,
  readApiErrorResponse,
} from '@energinet-datahub/dh/market-participant/domain';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

const csvExt = '.csv';
const csvMimeTypes = ['text/csv', 'application/vnd.ms-excel'];

@Component({
  selector: 'dh-imbalance-prices-uploader',
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
      (change)="onFileSelected(uploadInput.files)"
      #uploadInput
    />

    <watt-button
      icon="upload"
      variant="secondary"
      [loading]="uploadInProgress()"
      (click)="uploadInput.click()"
    >
      {{ 'imbalancePrices.uploadButton' | transloco }}
    </watt-button>`,
  imports: [TranslocoPipe, WattButtonComponent],
})
export class DhImbalancePricesUploaderComponent {
  private readonly httpClient = inject(HttpClient);
  private readonly toastService = inject(WattToastService);
  private readonly transloco = inject(TranslocoService);

  csvExt = csvExt;

  uploadInProgress = signal(false);

  uploadInput = viewChild.required<ElementRef<HTMLInputElement>>('uploadInput');

  uploadUrl = input.required<string>();

  uploadSuccess = output<void>();

  onFileSelected(files: FileList | null): void {
    if (files == null) {
      return;
    }

    const file = files[0];

    if (this.isValidFileType(file)) {
      return this.startUpload(file, this.uploadUrl());
    }
  }

  private isValidFileType(file: File): boolean {
    return csvMimeTypes.includes(file.type);
  }

  private startUpload(file: File, uploadUrl: string): void {
    const formData = new FormData();
    formData.append('csvFile', file);
    this.uploadInProgress.set(true);
    this.httpClient.post(uploadUrl, formData).subscribe({
      complete: () => this.uploadSuccessHandler(),
      error: (err: HttpErrorResponse) =>
        this.uploadErrorHandler(this.createApiErrorCollection(err)),
    });
  }

  private uploadSuccessHandler = () => {
    const message = this.transloco.translate('imbalancePrices.uploadSuccess');

    this.toastService.open({ type: 'success', message });

    this.resetUploadInput();
    this.uploadInProgress.set(false);
    this.uploadSuccess.emit();
  };

  private uploadErrorHandler = (apiErrorCollection: ApiErrorCollection) => {
    const message =
      apiErrorCollection.apiErrors.length > 0
        ? readApiErrorResponse([apiErrorCollection])
        : this.transloco.translate('imbalancePrices.uploadError');

    this.toastService.open({ type: 'danger', message });
    this.uploadInProgress.set(false);
    this.resetUploadInput();
  };

  private resetUploadInput(): void {
    this.uploadInput().nativeElement.value = '';
  }

  private createApiErrorCollection = (errorResponse: HttpErrorResponse): ApiErrorCollection => {
    return { apiErrors: errorResponse.error?.errors ?? [] };
  };
}
