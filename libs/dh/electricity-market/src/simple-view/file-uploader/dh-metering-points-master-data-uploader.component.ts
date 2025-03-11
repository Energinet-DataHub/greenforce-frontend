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
import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { translate, TranslocoPipe } from '@ngneat/transloco';
import { tapResponse } from '@ngrx/operators';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { dhApiEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

const csvExt = '.csv';
const csvMimeTypes = ['text/csv', 'application/vnd.ms-excel'];

@Component({
  selector: 'dh-metering-points-master-data-uploader',
  imports: [TranslocoPipe, WattButtonComponent],
  styles: [
    `
      :host {
        display: block;
      }

      .upload-input {
        margin-right: var(--watt-space-m);
      }
    `,
  ],
  template: `
    <input type="file" class="upload-input" [accept]="csvExt" #uploadInput />

    <watt-button (click)="upload(uploadInput.files)">
      {{ 'electricityMarket.uploadButton' | transloco }}
    </watt-button>
  `,
})
export class DhMeteringPointsMasterDataUploaderComponent {
  private readonly httpClient = inject(HttpClient);
  private readonly toastService = inject(WattToastService);
  private readonly api = inject(dhApiEnvironmentToken);

  private uploadInput = viewChild.required<ElementRef<HTMLInputElement>>('uploadInput');
  private uploadUrl = `${this.api.apiBase}/v1/ElectricityMarket/ImportTransactions`;

  csvExt = csvExt;

  upload(files: FileList | null): void {
    if (files == null || !files.length) {
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
    this.toastService.open({
      type: 'loading',
      message: translate('electricityMarket.uploadInProgress'),
    });

    const formData = new FormData();
    formData.append('csvFile', file);

    this.httpClient
      .post(this.uploadUrl, formData)
      .pipe(
        tapResponse(
          (importCount) => this.onUploadSuccessFn(importCount.toString()),
          () => this.onUploadErrorFn()
        )
      )
      .subscribe();
  }

  private onUploadSuccessFn = (importCount: string) => {
    const message = translate('electricityMarket.uploadSuccess', { count: importCount });

    this.toastService.open({ type: 'success', message });

    this.resetUploadInput();
  };

  private onUploadErrorFn = () => {
    const message = translate('electricityMarket.uploadError');

    this.toastService.open({ type: 'danger', message });

    this.resetUploadInput();
  };

  private resetUploadInput(): void {
    this.uploadInput().nativeElement.value = '';
  }
}
