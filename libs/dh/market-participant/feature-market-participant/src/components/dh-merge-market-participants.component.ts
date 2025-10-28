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
import { Component, computed, inject } from '@angular/core';
import { translate, TranslocoDirective } from '@jsverse/transloco';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { ResultOf } from '@graphql-typed-document-node/core';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_MODAL, WattTypedModal } from '@energinet-datahub/watt/modal';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattDatepickerComponent } from '@energinet-datahub/watt/datepicker';
import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import { dayjs } from '@energinet-datahub/watt/date';
import {
  EicFunction,
  GetMarketParticipantsDocument,
  GetMarketParticipantsForEicFunctionDocument,
  GetGridAreasDocument,
  MergeMarketParticipantsDocument,
  GetPaginatedMarketParticipantsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { dhUniqueMarketParticipantsValidator } from '../validators/dh-unique-market-participants.validator';

type MarketParticipant = ResultOf<
  typeof GetMarketParticipantsForEicFunctionDocument
>['marketParticipantsForEicFunction'][0];

@Component({
  selector: 'dh-merge-market-participants',
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
    <ng-container *transloco="let t; prefix: 'marketParticipant.mergeMarketParticipants'">
      <watt-modal size="small" [title]="t('title')">
        <form
          id="form-id"
          [formGroup]="form"
          vater-stack
          gap="m"
          align="start"
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
            [formControl]="form.controls.mergeDate"
            [min]="_7DaysFromNow"
          />
        </form>

        <watt-modal-actions>
          <watt-button variant="secondary" (click)="dialogRef.close(false)">
            {{ t('cancel') }}
          </watt-button>

          <watt-button type="submit" formId="form-id" [loading]="isSaving()">
            {{ t('save') }}
          </watt-button>
        </watt-modal-actions>
      </watt-modal>
    </ng-container>
  `,
})
export class DhMergeMarketParticipantsComponent extends WattTypedModal {
  private toastService = inject(WattToastService);

  private marketParticipantsQuery = query(GetMarketParticipantsForEicFunctionDocument, {
    variables: {
      eicFunctions: [EicFunction.GridAccessProvider],
    },
  });

  private createMergeMutation = mutation(MergeMarketParticipantsDocument);
  isSaving = this.createMergeMutation.loading;

  marketParticipantsOptions = computed<WattDropdownOptions>(() => {
    const marketParticipants =
      this.marketParticipantsQuery.data()?.marketParticipantsForEicFunction ?? [];

    return marketParticipants.map((mp) => ({
      value: mp.id,
      displayValue: this.marketParticipantDisplayValue(mp),
    }));
  });

  form = new FormGroup(
    {
      discontinuedEntity: new FormControl<string | null>(null, Validators.required),
      survivingEntity: new FormControl<string | null>(null, Validators.required),
      mergeDate: new FormControl<Date | null>(null, [Validators.required]),
    },
    { validators: dhUniqueMarketParticipantsValidator() }
  );

  _7DaysFromNow = dayjs().add(7, 'days').toDate();

  async save() {
    const { discontinuedEntity, survivingEntity, mergeDate } = this.form.value;

    if (!discontinuedEntity || !survivingEntity || !mergeDate) return;

    const result = await this.createMergeMutation.mutate({
      variables: {
        input: {
          discontinuedEntity,
          survivingEntity,
          mergeDate,
        },
      },
      refetchQueries: [
        GetMarketParticipantsDocument,
        GetPaginatedMarketParticipantsDocument,
        GetGridAreasDocument,
      ],
    });

    if (result.data?.mergeMarketParticipants.success) {
      this.toastService.open({
        type: 'success',
        message: translate('marketParticipant.mergeMarketParticipants.mergeSuccess'),
      });

      this.dialogRef.close(true);
    }

    if (result.error) {
      this.toastService.open({
        type: 'danger',
        message: translate('marketParticipant.mergeMarketParticipants.mergeError'),
      });
    }
  }

  private marketParticipantDisplayValue({ glnOrEicNumber, name, gridAreas }: MarketParticipant) {
    const formattedMarketParticipant = `${glnOrEicNumber} • ${name}`;

    if (gridAreas.length === 0) {
      return formattedMarketParticipant;
    }

    const translationBase =
      'marketParticipant.mergeMarketParticipants.marketParticipantDropdown.withGridAreas';

    if (gridAreas.length === 1) {
      return translate(`${translationBase}.singular`, {
        marketParticipant: formattedMarketParticipant,
        gridArea: gridAreas[0].code,
      });
    }

    return translate(`${translationBase}.plural`, {
      marketParticipant: formattedMarketParticipant,
      gridAreas: gridAreas.map((gridArea) => gridArea.code).join(', '),
    });
  }
}
