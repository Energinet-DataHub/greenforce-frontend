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
import { Component, computed, ElementRef, inject, output, viewChild } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattToastService } from '@energinet-datahub/watt/toast';
import {
  ApiErrorCollection,
  readApiErrorResponse,
} from '@energinet-datahub/dh/market-participant/data-access-api';
import { DhEsettDataAccessApiStore } from '@energinet-datahub/dh/esett/data-access-outgoing-messages';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { GetBalanceResponsibleImportUrlDocument } from '@energinet-datahub/dh/shared/domain/graphql';

const csvExt = '.csv';
const csvMimeTypes = ['text/csv', 'application/vnd.ms-excel'];

@Component({
  selector: 'dh-balance-responsible-importer',
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
  providers: [DhEsettDataAccessApiStore],
  imports: [TranslocoPipe, WattButtonComponent],
})
export class DhBalanceResponsibleImporterComponent {
  private readonly store = inject(DhEsettDataAccessApiStore);
  private readonly toastService = inject(WattToastService);
  private readonly transloco = inject(TranslocoService);

  private readonly getBalanceResponsibleImportUrl = query(GetBalanceResponsibleImportUrlDocument);

  uploadUrl = computed(
    () =>
      this.getBalanceResponsibleImportUrl.data()?.balanceResponsibleImport
        .balanceResponsibleImportUrl
  );

  csvExt = csvExt;

  uploadInput = viewChild.required<ElementRef<HTMLInputElement>>('uploadInput');
  uploadInProgress = toSignal(this.store.uploadInProgress$, { requireSync: true });
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
    this.store.uploadCSV({
      file,
      uploadUrl,
      onSuccess: this.onUploadSuccessFn,
      onError: this.onUploadErrorFn,
    });
  }

  private onUploadSuccessFn = () => {
    const message = this.transloco.translate('eSett.balanceResponsible.importSuccess');

    this.toastService.open({ type: 'success', message });

    this.resetUploadInput();
    this.uploadSuccess.emit();
  };

  private onUploadErrorFn = (apiErrorCollection: ApiErrorCollection) => {
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
}
