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
import { Component, computed, inject } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_MODAL, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { JsonPipe } from '@angular/common';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import {
  EicFunction,
  GetActorsForEicFunctionDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-merge-market-participants',
  standalone: true,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    JsonPipe,

    WATT_MODAL,
    WattDatepickerComponent,
    WattButtonComponent,
    WattDropdownComponent,
  ],
  template: `
    <ng-container *transloco="let t; read: 'marketParticipant.mergeMarketParticipants'">
      {{ form.valid }}
      <watt-modal size="small" [title]="t('title')">
        <form id="form-id" [formGroup]="form" (ngSubmit)="form.valid && save()">
          <watt-dropdown
            [label]="t('discontinuedEntity')"
            [formControl]="form.controls.discontinuedEntity"
            [options]="marketParticipantsOptions()"
          />

          <watt-dropdown
            [label]="t('survivingEntity')"
            [formControl]="form.controls.survivingEntity"
            [options]="marketParticipantsOptions()"
          />

          <watt-datepicker [label]="t('mergeDate')" [formControl]="form.controls.date" />
        </form>

        {{ form.value | json }}

        <watt-modal-actions>
          <watt-button variant="secondary" (click)="closeModal(false)">
            {{ t('cancel') }}
          </watt-button>

          <watt-button type="submit" formId="form-id">
            {{ t('save') }}
          </watt-button>
        </watt-modal-actions>
      </watt-modal>
    </ng-container>
  `,
})
export class DhMergeMarketParticipantsComponent extends WattTypedModal {
  private formBuilder = inject(FormBuilder);

  private marketParticipantsQuery = query(GetActorsForEicFunctionDocument, {
    variables: {
      eicFunctions: [EicFunction.GridAccessProvider],
    },
  });

  marketParticipantsOptions = computed<WattDropdownOptions>(() => {
    const mp = this.marketParticipantsQuery.data()?.actorsForEicFunction ?? [];

    return mp.map((actor) => ({
      value: actor.glnOrEicNumber,
      displayValue: `${actor.glnOrEicNumber} • ${actor.name}`,
    }));
  });

  form = this.formBuilder.group({
    survivingEntity: [null, Validators.required],
    discontinuedEntity: [null, Validators.required],
    date: ['', Validators.required],
  });

  constructor() {
    super();
  }

  closeModal(result: boolean) {
    this.dialogRef.close(result);
  }

  save() {
    console.log('Save', this.form.value);
    console.log('Is valid', this.form.valid);
  }
}
