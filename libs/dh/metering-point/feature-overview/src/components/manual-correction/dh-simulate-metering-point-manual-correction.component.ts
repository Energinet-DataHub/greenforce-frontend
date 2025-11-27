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
import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { SimulateMeteringPointManualCorrectionDocument } from '@energinet-datahub/dh/shared/domain/graphql';

import { toFile } from '@energinet-datahub/dh/shared/ui-util';
import { WattMenuItemComponent } from '@energinet/watt/menu';

@Component({
  selector: 'dh-simulate-metering-point-manual-correction',
  imports: [TranslocoDirective, ReactiveFormsModule, WattMenuItemComponent],
  styles: `
    .simulate-manual-correction-input {
      display: none;
    }
  `,
  template: `
    <input
      id="simulate-manual-correction-input"
      class="simulate-manual-correction-input"
      type="file"
      accept="json"
      (change)="onFileSelected(fileUpload.files)"
      #fileUpload
    />
    <watt-menu-item
      *transloco="let t; prefix: 'meteringPoint.overview.manualCorrection'"
      (click)="fileUpload.click()"
    >
      <span>{{ t('verifyCorrection') }}</span>
    </watt-menu-item>
  `,
})
export class DhSimulateMeteringPointManualCorrectionComponent {
  @ViewChild('fileUpload')
  fileUpload!: ElementRef<HTMLInputElement>;

  meteringPointId = input.required<string>();

  private readonly simulateMeteringPointManualCorrectionQuery = mutation(
    SimulateMeteringPointManualCorrectionDocument
  );

  async onFileSelected(files: FileList | null): Promise<void> {
    if (files == null) {
      return;
    }

    const file = files[0];
    const content = await file.text();

    this.fileUpload.nativeElement.value = '';

    const result = await this.simulateMeteringPointManualCorrectionQuery.mutate({
      variables: {
        input: {
          meteringPointId: this.meteringPointId(),
          json: content,
        },
      },
    });

    toFile({
      data: result.data?.simulateMeteringPointManualCorrection.string,
      name: `${this.meteringPointId()}.txt`,
      type: 'text/plain;charset=utf-8;',
    });
  }
}
