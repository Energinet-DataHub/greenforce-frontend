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
import {
  input,
  model,
  inject,
  effect,
  computed,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import { TranslocoDirective } from '@jsverse/transloco';

import { WATT_MODAL } from '@energinet/watt/modal';
import { WattIconComponent } from '@energinet/watt/icon';
import { VaterStackComponent } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattTooltipDirective } from '@energinet/watt/tooltip';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet/watt/dropdown';

import { injectToast } from '@energinet-datahub/dh/shared/ui-util';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import { lazyQuery, mutation, MutationStatus } from '@energinet-datahub/dh/shared/util-apollo';
import { DhChargesTypeSelection } from '@energinet-datahub/dh/charges/ui-shared';

import {
  ChargeType,
  GetChargeByTypeDocument,
  CreateChargeLinkDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';

@Component({
  selector: 'dh-metering-point-create-charge-link',
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    WATT_MODAL,
    WattButtonComponent,
    WattDropdownComponent,
    WattTextFieldComponent,
    WattDatepickerComponent,
    VaterStackComponent,
    DhChargesTypeSelection,
    WattIconComponent,
    WattTooltipDirective,
  ],
  encapsulation: ViewEncapsulation.None,
  styles: `
    dh-metering-point-create-charge-link {
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
      autoOpen
      *transloco="let t; prefix: 'meteringPoint.chargeLinks.create'"
      (closed)="createLink($event)"
    >
      <h2 class="watt-modal-title watt-modal-title-icon">
        {{ t('title') }}
        <watt-icon [style.color]="'black'" name="info" [wattTooltip]="t('tooltip')" />
      </h2>
      <dh-charges-type-selection [(value)]="selectedType">
        @if (selectedType()) {
          <form
            vater-stack
            align="start"
            scrollable
            direction="column"
            gap="s"
            tabindex="-1"
            [formGroup]="form()"
          >
            <watt-dropdown
              [formControl]="form().controls.chargeId"
              [options]="chargeOptions()"
              [label]="t('chargeTypes.' + selectedType())"
            />

            @if (selectedType() !== 'TARIFF') {
              <watt-text-field
                [formControl]="form().controls.factor"
                [label]="t('factor')"
                type="number"
              />
            }

            <watt-datepicker [formControl]="form().controls.startDate" [label]="t('startDate')" />
          </form>
        }
      </dh-charges-type-selection>
      <watt-modal-actions>
        @if (!selectedType()) {
          <watt-button variant="secondary" (click)="create.close(false)">
            {{ t('close') }}
          </watt-button>
        } @else {
          <watt-button variant="secondary" (click)="selectedType.set(null)">
            {{ t('back') }}
          </watt-button>
          <watt-button variant="primary" (click)="create.close(true)">
            {{ t('actions.' + selectedType()) }}
          </watt-button>
        }
      </watt-modal-actions>
    </watt-modal>
  `,
})
export default class DhMeteringPointCreateChargeLink {
  private readonly navigate = inject(DhNavigationService);
  private readonly toast = injectToast('meteringPoint.chargeLinks.create.toast');
  private readonly createChargeLink = mutation(CreateChargeLinkDocument);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly chargesQuery = lazyQuery(GetChargeByTypeDocument);

  form = computed(() =>
    this.fb.group({
      chargeId: this.fb.control<string>('', Validators.required),
      factor: this.fb.control<string | null>(
        null,
        this.selectedType() !== 'TARIFF' ? Validators.min(1) : null
      ),
      startDate: this.fb.control<Date | null>(null, Validators.required),
    })
  );

  meteringPointId = input.required<string>();

  selectedType = model<ChargeType | null>(null);

  chargeOptions = computed<WattDropdownOptions>(
    () => this.chargesQuery.data()?.chargesByType ?? []
  );

  async createLink(saved: boolean) {
    if (!saved) return this.navigate.navigate('list');

    const form = this.form();
    if (form.invalid) return;

    const { chargeId, startDate, factor } = form.getRawValue();

    assertIsDefined(chargeId);
    assertIsDefined(startDate);

    await this.createChargeLink.mutate({
      variables: {
        chargeId,
        meteringPointId: this.meteringPointId(),
        newStartDate: startDate,
        factor: parseInt(factor ?? '10'),
      },
    });

    this.navigate.navigate('list');
  }

  constructor() {
    effect(() => {
      const type = this.selectedType();

      if (type) {
        this.chargesQuery.refetch({ type });
      }
    });

    effect(() => this.toast(this.createChargeLink.status()));
  }
}
