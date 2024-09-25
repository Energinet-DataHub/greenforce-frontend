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
import { Component, computed, output, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';

import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDatetimepickerComponent } from '@energinet-datahub/watt/datetimepicker';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattModalActionsComponent, WattModalComponent } from '@energinet-datahub/watt/modal';

import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  BusinessReason,
  DocumentType,
  GetActorsDocument,
  GetArchivedMessagesQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { form } from './form/start';

@Component({
  selector: 'dh-message-archive-search-start',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VaterStackComponent,
    WattButtonComponent,
    WattDatetimepickerComponent,
    WattModalComponent,
    WattModalActionsComponent,
    WattDropdownComponent,
    DhDropdownTranslatorDirective,
  ],
  template: `
    <watt-modal
      #modal
      *transloco="let t; read: 'messageArchive.start'"
      size="small"
      [title]="t('title')"
      (closed)="close.emit($event)"
    >
      <form
        vater-stack
        gap="s"
        offset="m"
        id="dh-message-archive-search-start-form"
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
      >
        <watt-dropdown
          [label]="t('documentType')"
          [formControl]="form.controls.documentTypes"
          [options]="documentTypeOptions"
          [placeholder]="t('placeholder')"
          [multiple]="true"
        />
        <watt-dropdown
          [label]="t('businessReason')"
          [formControl]="form.controls.businessReasons"
          [options]="businessReasonOptions"
          [placeholder]="t('placeholder')"
          [multiple]="true"
          dhDropdownTranslator
          translateKey="messageArchive.businessReason"
        />
        <watt-dropdown
          [label]="t('sender')"
          [formControl]="form.controls.senderNumber"
          [options]="actorOptions()"
          [placeholder]="t('placeholder')"
        />
        <watt-dropdown
          [label]="t('receiver')"
          [formControl]="form.controls.receiverNumber"
          [options]="actorOptions()"
          [placeholder]="t('placeholder')"
        />
        <watt-datetimepicker [label]="t('start')" [formControl]="form.controls.start" />
        <watt-datetimepicker [label]="t('end')" [formControl]="form.controls.end" />
      </form>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(true)">
          {{ t('cancel') }}
        </watt-button>
        <watt-button
          (click)="modal.close(false)"
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
  form = form;

  search = output<GetArchivedMessagesQueryVariables>();
  close = output<boolean>();
  modal = viewChild.required<WattModalComponent>('modal');

  documentTypeOptions = dhEnumToWattDropdownOptions(DocumentType);
  businessReasonOptions = dhEnumToWattDropdownOptions(BusinessReason);

  actorsQuery = query(GetActorsDocument);
  actors = computed(() => this.actorsQuery.data()?.actors ?? []);
  actorOptions = computed(() =>
    this.actors().map((actor) => ({
      value: actor.glnOrEicNumber,
      displayValue: actor.name || actor.glnOrEicNumber,
    }))
  );

  onSubmit = () => {
    const values = this.form.getRawValue();
    if (!values || !values.start) return;
    const { start, end, ...variables } = values;
    this.search.emit({ ...variables, created: { start, end } });
  };
}
