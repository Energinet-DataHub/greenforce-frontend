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
import { Component, computed, signal, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDatetimepickerComponent } from '@energinet-datahub/watt/datetimepicker';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattModalActionsComponent, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattTimepickerComponent } from '@energinet-datahub/watt/timepicker';

import { dhEnumToWattDropdownOptions } from '@energinet-datahub/dh/shared/ui-util';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  BusinessReason,
  DocumentType,
  GetActorsDocument,
  GetArchivedMessagesQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { form, FormValues } from './form';

@Component({
  selector: 'dh-message-archive-search-start',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    WattButtonComponent,
    WattDatetimepickerComponent,
    WattModalComponent,
    WattModalActionsComponent,
    WattTextFieldComponent,
    WattTimepickerComponent,
    WattDropdownComponent,
  ],
  template: `
    <watt-modal #modal *transloco="let t; read: 'messageArchive.search'" size="small" title="New">
      <form
        id="dh-message-archive-search-start-form"
        [formGroup]="form"
        (ngSubmit)="values.set(form.getRawValue())"
      >
        <!-- MessageId -->
        <watt-text-field [label]="t('messageId')" [formControl]="form.controls.messageId" />

        <!-- Document Type -->
        <watt-dropdown
          [label]="t('documentType')"
          [formControl]="form.controls.documentTypes"
          [options]="documentTypeOptions"
          [placeholder]="t('typeOrChoose')"
          [multiple]="true"
        />

        <!-- Business Reason -->
        <watt-dropdown
          [label]="t('businessReason')"
          [formControl]="form.controls.businessReasons"
          [options]="businessReasonOptions"
          [placeholder]="t('typeOrChoose')"
          [multiple]="true"
        />

        <!-- Sender -->
        <watt-dropdown
          [label]="t('senderGln')"
          [formControl]="form.controls.senderNumber"
          [options]="actorOptions()"
          [placeholder]="t('typeOrChoose')"
        />

        <!-- Receiver -->
        <watt-dropdown
          [label]="t('receiverGln')"
          [formControl]="form.controls.receiverNumber"
          [options]="actorOptions()"
          [placeholder]="t('typeOrChoose')"
        />

        <!-- From -->
        <watt-datetimepicker [label]="t('periode')" [formControl]="form.controls.start" />

        <!-- To -->
        <watt-datetimepicker [label]="t('time')" [formControl]="form.controls.end" />

        <!-- Reference id -->
        <watt-checkbox [formControl]="form.controls.includeRelated" wattInput name="reference-id">
          {{ t('includeRelatedMessage') }}
        </watt-checkbox>
      </form>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">Cancel</watt-button>
        <watt-button type="submit" formId="dh-message-archive-search-start-form">
          Confirm
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhMessageArchiveSearchStartComponent {
  form = form;

  modal = viewChild.required<WattModalComponent>('modal');
  values = signal<FormValues | null>(null);
  variables = computed(() => {
    const values = this.values();
    if (!values) return undefined;
    const { start, end, ...variables } = values;
    return { ...variables, created: { start, end } } as GetArchivedMessagesQueryVariables;
  });

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
}
