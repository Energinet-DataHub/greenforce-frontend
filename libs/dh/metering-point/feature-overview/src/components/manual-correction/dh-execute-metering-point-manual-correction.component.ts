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
import { Component, ElementRef, inject, input, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { ExecuteMeteringPointManualCorrectionDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { WattMenuItemComponent } from '@energinet/watt/menu';
import { WattToastService } from '@energinet/watt/toast';

@Component({
  selector: 'dh-execute-metering-point-manual-correction',
  imports: [TranslocoDirective, ReactiveFormsModule, WattMenuItemComponent],
  styles: `
    .execute-manual-correction-input {
      display: none;
    }
  `,
  template: `
    <input
      id="execute-manual-correction-input"
      class="execute-manual-correction-input"
      type="file"
      accept="json"
      (change)="onFileSelected(fileUpload.files)"
      #fileUpload
    />
    <watt-menu-item
      *transloco="let t; prefix: 'meteringPoint.overview.manualCorrection'"
      (click)="fileUpload.click()"
    >
      <span>{{ t('executeCorrection') }}</span>
    </watt-menu-item>
  `,
})
export class DhExecuteMeteringPointManualCorrectionComponent {
  @ViewChild('fileUpload')
  fileUpload!: ElementRef<HTMLInputElement>;

  meteringPointId = input.required<string>();

  private transloco = inject(TranslocoService);
  private readonly toastService = inject(WattToastService);

  private readonly executeMeteringPointManualCorrectionQuery = mutation(
    ExecuteMeteringPointManualCorrectionDocument
  );

  async onFileSelected(files: FileList | null): Promise<void> {
    if (files == null) {
      return;
    }

    const file = files[0];
    const content = await file.text();

    this.fileUpload.nativeElement.value = '';

    const response = await this.executeMeteringPointManualCorrectionQuery.mutate({
      variables: {
        input: {
          meteringPointId: this.meteringPointId(),
          json: content,
        },
      },
    });

    if (response.error) {
      this.toastService.open({
        type: 'danger',
        message: this.transloco.translate('meteringPoint.overview.manualCorrection.saveError'),
      });
    } else {
      this.toastService.open({
        type: 'success',
        message: this.transloco.translate('meteringPoint.overview.manualCorrection.saveSuccess'),
      });
    }
  }
}
