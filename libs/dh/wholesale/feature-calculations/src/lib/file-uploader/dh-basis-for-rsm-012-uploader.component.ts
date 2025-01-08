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
import { translate } from '@ngneat/transloco';
import { tapResponse } from '@ngrx/operators';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { dhApiEnvironmentToken } from '@energinet-datahub/dh/shared/environments';

const jsonExt = '.json';
const jsonMimeType = 'application/json';

@Component({
  selector: 'dh-basis-for-rsm-012-uploader',
  styles: [
    `
      .upload-input {
        display: none;
      }
    `,
  ],
  template: `<input
    type="file"
    class="upload-input"
    [accept]="jsonExt"
    (change)="onFileSelected(uploadInput.files)"
    #uploadInput
  />`,
})
export class DhBasisForRSM012UploaderComponent {
  private readonly httpClient = inject(HttpClient);
  private readonly toastService = inject(WattToastService);
  private readonly api = inject(dhApiEnvironmentToken);

  private uploadUrl = `${this.api.apiBase}/v1/Dh2Bridge/ImportCapacitySettlements`;
  private uploadInput = viewChild.required<ElementRef<HTMLInputElement>>('uploadInput');

  jsonExt = jsonExt;

  selectFile(): void {
    this.uploadInput().nativeElement.click();
  }

  onFileSelected(files: FileList | null): void {
    if (files == null) {
      return;
    }

    const file = files[0];

    if (file.type === jsonMimeType) {
      return this.startUpload(file, this.uploadUrl);
    }
  }

  private startUpload(file: File, uploadUrl: string): void {
    this.toastService.open({
      type: 'loading',
      message: translate('wholesale.calculations.basisForRSM012.uploadInProgress'),
    });

    const formData = new FormData();
    formData.append('jsonFile', file);

    this.httpClient
      .post(uploadUrl, formData)
      .pipe(
        tapResponse(
          () => this.onUploadSuccessFn(),
          () => this.onUploadErrorFn()
        )
      )
      .subscribe();
  }

  private onUploadSuccessFn = () => {
    const message = translate('wholesale.calculations.basisForRSM012.uploadSuccess');

    this.toastService.open({ type: 'success', message });

    this.resetUploadInput();
  };

  private onUploadErrorFn = () => {
    const message = translate('wholesale.calculations.basisForRSM012.uploadError');

    this.toastService.open({ type: 'danger', message });

    this.resetUploadInput();
  };

  private resetUploadInput(): void {
    this.uploadInput().nativeElement.value = '';
  }
}
