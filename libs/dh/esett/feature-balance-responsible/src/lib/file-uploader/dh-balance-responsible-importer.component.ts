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
} from '@energinet-datahub/dh/market-participant/data-access-api';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tapResponse } from '@ngrx/operators';
import { finalize } from 'rxjs/operators';

const csvExt = '.csv';
const csvMimeTypes = ['text/csv', 'application/vnd.ms-excel'];

@Component({
  selector: 'dh-balance-responsible-importer',
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
      {{ 'eSett.balanceResponsible.importButton' | transloco }}
    </watt-button>`,
  imports: [TranslocoPipe, WattButtonComponent],
})
export class DhBalanceResponsibleImporterComponent {
  private readonly client = inject(HttpClient);
  private readonly toastService = inject(WattToastService);
  private readonly transloco = inject(TranslocoService);
  csvExt = csvExt;

  uploadUrl = input.required<string | undefined | null>();
  uploadInput = viewChild.required<ElementRef<HTMLInputElement>>('uploadInput');
  uploadInProgress = signal(false);
  uploadSuccess = output<void>();

  onFileSelected(files: FileList | null): void {
    if (files == null) {
      return;
    }

    const file = files[0];

    if (this.isValidFileType(file)) {
      const url = this.uploadUrl();
      if (url) {
        return this.startUpload(file, url);
      }
    }
  }

  private isValidFileType(file: File): boolean {
    return csvMimeTypes.includes(file.type);
  }

  private startUpload(file: File, uploadUrl: string): void {
    this.uploadInProgress.set(true);
    const formData = new FormData();
    formData.append('balanceResponsibility', file);
    this.client
      .post(uploadUrl, formData)
      .pipe(
        tapResponse(this.onUploadSuccess, (errorResponse: HttpErrorResponse) =>
          this.onUploadError(this.createApiErrorCollection(errorResponse))
        ),
        finalize(() => this.uploadInProgress.set(false))
      )
      .subscribe();
  }

  private onUploadSuccess = () => {
    const message = this.transloco.translate('eSett.balanceResponsible.importSuccess');

    this.toastService.open({ type: 'success', message });

    this.resetUploadInput();
    this.uploadSuccess.emit();
  };

  private onUploadError = (apiErrorCollection: ApiErrorCollection) => {
    const message =
      apiErrorCollection.apiErrors.length > 0
        ? readApiErrorResponse([apiErrorCollection])
        : this.transloco.translate('eSett.balanceResponsible.importError');

    this.toastService.open({ type: 'danger', message });

    this.resetUploadInput();
  };

  private resetUploadInput(): void {
    this.uploadInput().nativeElement.value = '';
  }

  private createApiErrorCollection = (errorResponse: HttpErrorResponse): ApiErrorCollection => {
    return { apiErrors: errorResponse.error?.errors ?? [] };
  };
}
