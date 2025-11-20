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
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, computed, effect, inject, signal, ViewEncapsulation } from '@angular/core';

import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { VaterStackComponent } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WATT_MODAL, WattTypedModal } from '@energinet/watt/modal';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet/watt/dropdown';

import { lazyQuery, query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhActorStorage } from '@energinet-datahub/dh/shared/feature-authorization';

import {
  ChargeType,
  EicFunction,
  GetChargeByTypeAndOwnerDocument,
  GetSyoMarketParticipantDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-metering-point-create-charge-link',
  imports: [
    TranslocoPipe,
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_MODAL,
    WattButtonComponent,
    WattDropdownComponent,
    WattTextFieldComponent,
    WattDatepickerComponent,

    VaterStackComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  styles: `
    dh-metering-point-create-charge-link {
      watt-button .mdc-button.mat-mdc-button {
        width: 100%;
      }

      vater-stack {
        margin: var(--watt-space-m) 0;
      }

      watt-datepicker,
      watt-text-field {
        width: 50%;
      }
    }
  `,
  template: `
    <watt-modal
      #create
      size="small"
      *transloco="let t; prefix: 'meteringPoint.createChargeLink'"
      [title]="t('title')"
    >
      @let type = selectedType();
      @if (type === null) {
        <vater-stack align="stretch" gap="ml">
          @for (chargeType of ChargeTypes; track chargeType) {
            <watt-button
              alignText="start"
              variant="selection"
              icon="right"
              (click)="selectedType.set(chargeType)"
            >
              {{ 'charges.chargeTypes.' + chargeType | transloco }}
            </watt-button>
          }
        </vater-stack>
      } @else {
        <form
          vater-stack
          align="start"
          scrollable
          direction="column"
          gap="s"
          tabindex="-1"
          [formGroup]="form"
        >
          <watt-dropdown
            [formControl]="form.controls.chargeId"
            [options]="chargeOptions()"
            [label]="t('chargeTypes.' + selectedType())"
          />

          @if (selectedType() !== ChargeType.Tariff) {
            <watt-text-field
              [formControl]="form.controls.factor"
              [label]="t('factor')"
              type="number"
            />
          }

          <watt-datepicker [formControl]="form.controls.startDate" [label]="t('startDate')" />
        </form>
      }
      <watt-modal-actions>
        @if (type === null) {
          <watt-button variant="secondary" (click)="create.close(false)">
            {{ t('close') }}
          </watt-button>
        } @else {
          <watt-button variant="secondary" (click)="selectedType.set(null)">
            {{ t('back') }}
          </watt-button>
          <watt-button
            variant="primary"
            (click)="createLink(); create.close(true)"
            [disabled]="form.invalid"
          >
            {{ t('actions.' + type) }}
          </watt-button>
        }
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhMeteringPointCreateChargeLink extends WattTypedModal {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly actorStorage = inject(DhActorStorage);
  private readonly syoMarketParticipantQuery = query(GetSyoMarketParticipantDocument);
  private readonly chargesQuery = lazyQuery(GetChargeByTypeAndOwnerDocument);
  private readonly syoMarketParticipantGln = computed(
    () =>
      this.syoMarketParticipantQuery.data()?.marketParticipantsForEicFunction[0].glnOrEicNumber ??
      ''
  );

  ChargeTypes = Object.values(ChargeType);
  ChargeType = ChargeType;

  form = this.fb.group({
    chargeId: this.fb.control<string>('', Validators.required),
    factor: this.fb.control<number | null>(null, Validators.min(1)),
    startDate: this.fb.control<Date | null>(null, Validators.required),
  });

  selectedType = signal<ChargeType | null>(null);

  chargeOptions = computed<WattDropdownOptions>(() =>
    (this.chargesQuery.data()?.chargesByTypeAndOwner ?? []).map((charge) => ({
      value: charge.id,
      displayValue: charge.displayName,
    }))
  );

  createLink() {
    console.log('Create this', this.form.value);
  }

  constructor() {
    super();
    effect(() => {
      const type = this.selectedType();
      const syoGln = this.syoMarketParticipantGln();
      const selectedMarketParticipant = this.actorStorage.getSelectedActor();

      if (type) {
        this.chargesQuery.refetch({
          owner:
            selectedMarketParticipant.marketRole === EicFunction.SystemOperator ||
            EicFunction.EnergySupplier
              ? syoGln
              : selectedMarketParticipant.gln,
          type,
        });
      }
    });
  }
}
