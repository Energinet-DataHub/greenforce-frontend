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
import { translate, TranslocoDirective } from '@ngneat/transloco';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_MODAL, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { dayjs } from '@energinet-datahub/watt/date';
import {
  EicFunction,
  GetActorsForEicFunctionDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';

@Component({
  selector: 'dh-merge-market-participants',
  standalone: true,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    VaterStackComponent,
    WATT_MODAL,
    WattDatepickerComponent,
    WattButtonComponent,
    WattFieldErrorComponent,
    WattDropdownComponent,
  ],
  styles: `
    :host {
      display: block;
    }

    watt-dropdown {
      width: 400px;
    }

    watt-datepicker {
      width: 260px;
    }
  `,
  template: `
    <ng-container *transloco="let t; read: 'marketParticipant.mergeMarketParticipants'">
      <watt-modal size="small" [title]="t('title')">
        <form
          id="form-id"
          [formGroup]="form"
          vater-stack
          gap="m"
          align="flex-start"
          (ngSubmit)="form.valid && save()"
        >
          @if (form.hasError('notUniqueMarketParticipants')) {
            <watt-field-error>{{ t('notUniqueMarketParticipants') }}</watt-field-error>
          }

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

          <watt-datepicker
            [label]="t('mergeDate')"
            [formControl]="form.controls.date"
            [min]="_7DaysFromNow"
          />
        </form>

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
    const marketParticipants = this.marketParticipantsQuery.data()?.actorsForEicFunction ?? [];

    return marketParticipants.map((mp) => ({
      value: mp.id,
      displayValue: translate(
        'marketParticipant.mergeMarketParticipants.marketParticipantDropdownDisplayValue',
        {
          marketParticipant: `${mp.glnOrEicNumber} • ${mp.name}`,
          gridArea: mp.gridAreas[0].code,
        }
      ),
    }));
  });

  form = this.formBuilder.group(
    {
      discontinuedEntity: [null, Validators.required],
      survivingEntity: [null, Validators.required],
      date: ['', Validators.required],
    },
    { validators: this.uniqueMarketParticipants() }
  );

  _7DaysFromNow = dayjs().add(7, 'days').toDate();

  closeModal(result: boolean) {
    this.dialogRef.close(result);
  }

  save() {
    console.log('Save', this.form.value);
  }

  uniqueMarketParticipants(): ValidatorFn {
    return (formGroup: AbstractControl) => {
      const discontinuedEntityControl = formGroup.get('discontinuedEntity');
      const survivingEntityControl = formGroup.get('survivingEntity');

      if (formGroup.untouched) {
        return null;
      }

      discontinuedEntityControl?.setErrors(null);
      survivingEntityControl?.setErrors(null);

      if (discontinuedEntityControl?.value === survivingEntityControl?.value) {
        survivingEntityControl?.setErrors({ notUniqueMarketParticipants: true });
        discontinuedEntityControl?.setErrors({ notUniqueMarketParticipants: true });

        return { notUniqueMarketParticipants: true };
      }

      return null;
    };
  }
}
