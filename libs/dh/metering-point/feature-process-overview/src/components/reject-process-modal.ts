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
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

import { WATT_MODAL, WattTypedModal } from '@energinet/watt/modal';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattDatePipe } from '@energinet/watt/date';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { WattTextAreaFieldComponent } from '@energinet/watt/textarea-field';
import { VaterStackComponent } from '@energinet/watt/vater';

import { ReasonCodeV1 } from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  DhEmDashFallbackPipe,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';

export interface RejectProcessModalData {
  cutoffDate?: Date | null;
}

export interface RejectProcessResult {
  reasonCode: ReasonCodeV1;
  reasonMessage: string;
  description: string | null;
}

@Component({
  selector: 'dh-reject-process-modal',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WATT_MODAL,
    WattButtonComponent,
    WattDatePipe,
    WattDropdownComponent,
    WattTextAreaFieldComponent,
    VaterStackComponent,
    DhDropdownTranslatorDirective,
    DhEmDashFallbackPipe,
  ],
  styles: `
    .labels {
      margin-bottom: var(--watt-space-sm);
    }
  `,
  template: `
    <watt-modal
      *transloco="let t; prefix: 'meteringPoint.processOverview.rejectProcess'"
      [title]="t('title')"
      size="small"
      #modal
    >
      <vater-stack class="labels" direction="column" align="start">
        <div>
          <p class="watt-label">{{ t('requestedService') }}</p>
        </div>

        <div>
          <p class="watt-label">{{ t('cutoffDate') }}</p>
          <p class="watt-text-s">{{ modalData.cutoffDate | wattDate | dhEmDashFallback }}</p>
        </div>

        <div>
          <p class="watt-label">{{ t('response') }}</p>
          <p class="watt-text-s">{{ t('responseValue') }}</p>
        </div>
      </vater-stack>

      <form id="reject-process-form" [formGroup]="form" (ngSubmit)="submit()">
        <vater-stack direction="column" gap="m">
          <watt-dropdown
            dhDropdownTranslator
            translateKey="meteringPoint.processOverview.rejectProcess.reasonCodes"
            [label]="t('reasonCodeLabel')"
            [placeholder]="t('reasonCodePlaceholder')"
            [formControl]="form.controls.reasonCode"
            [options]="reasonCodeOptions"
            [showResetOption]="false"
          />

          <watt-textarea-field
            [label]="t('descriptionLabel')"
            [formControl]="form.controls.description"
          />
        </vater-stack>
      </form>

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="cancel()">
          {{ t('cancel') }}
        </watt-button>

        <watt-button type="submit" formId="reject-process-form">
          {{ t('confirm') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhRejectProcessModal extends WattTypedModal<RejectProcessModalData> {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly transloco = inject(TranslocoService);

  readonly reasonCodeOptions = dhEnumToWattDropdownOptions(ReasonCodeV1);

  readonly form = this.fb.group({
    reasonCode: this.fb.control<ReasonCodeV1 | null>(null, Validators.required),
    description: this.fb.control<string | null>(null),
  });

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    if (this.form.invalid) return;

    const { reasonCode, description } = this.form.getRawValue();
    if (!reasonCode) return;

    const reasonMessage = this.transloco
      .translate(`meteringPoint.processOverview.rejectProcess.reasonCodes.${reasonCode}`)
      .replace(/\s*\(D\d+\)$/, '');

    this.dialogRef.close({ reasonCode, reasonMessage, description } satisfies RejectProcessResult);
  }
}
