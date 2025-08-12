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
import { Component, inject, output, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { VaterFlexComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDateTimeField } from '@energinet-datahub/watt/datetime-field';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattModalActionsComponent, WattModalComponent } from '@energinet-datahub/watt/modal';

import { DhDropdownTranslatorDirective } from '@energinet-datahub/dh/shared/ui-util';
import { GetArchivedMessagesQueryVariables } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhMessageArchiveSearchFormService } from './form.service';
import { DhDateTimeRangeField } from './datetime-range-field';

@Component({
  selector: 'dh-message-archive-search-start',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VaterFlexComponent,
    WattButtonComponent,
    WattDropdownComponent,
    WattModalActionsComponent,
    WattModalComponent,
    DhDateTimeRangeField,
    DhDropdownTranslatorDirective,
  ],
  template: `
    <watt-modal
      #modal
      *transloco="let t; read: 'messageArchive.start'"
      size="small"
      [title]="t('title')"
    >
      <form
        vater-flex
        gap="s"
        offset="m"
        id="dh-message-archive-search-start-form"
        [formGroup]="form.root"
        (ngSubmit)="searchChanged.emit(form.values())"
      >
        <dh-datetime-range-field
          [formControl]="form.controls.created"
          [labelStart]="t('start')"
          [labelEnd]="t('end')"
        />

        <watt-dropdown
          [label]="t('documentType')"
          [formControl]="form.controls.documentTypes"
          [options]="form.documentTypeOptions"
          [placeholder]="t('placeholder')"
          [multiple]="true"
          dhDropdownTranslator
          translateKey="messageArchive.documentType"
        />

        <watt-dropdown
          [label]="t('businessReason')"
          [formControl]="form.controls.businessReasons"
          [options]="form.businessReasonOptions"
          [placeholder]="t('placeholder')"
          [multiple]="true"
          dhDropdownTranslator
          translateKey="messageArchive.businessReason"
        />

        @if (form.isActorControlsEnabled()) {
          <watt-dropdown
            [label]="t('sender')"
            [formControl]="form.controls.senderId"
            [options]="form.actorOptions()"
            [placeholder]="t('placeholder')"
          />

          <watt-dropdown
            [label]="t('receiver')"
            [formControl]="form.controls.receiverId"
            [options]="form.actorOptions()"
            [placeholder]="t('placeholder')"
          />
        }
      </form>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="form.reset()">
          {{ t('reset') }}
        </watt-button>
        <watt-button
          (click)="modal.close(true)"
          type="submit"
          formId="dh-message-archive-search-start-form"
        >
          {{ t('confirm') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhMessageArchiveSearchStartComponent {
  form = inject(DhMessageArchiveSearchFormService);
  searchChanged = output<GetArchivedMessagesQueryVariables>();
  modal = viewChild.required(WattModalComponent);

  open = () => {
    this.form.synchronize();
    this.modal().open();
  };
}
