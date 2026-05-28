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

import { Component, computed, effect, input, viewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';

import { WATT_MODAL, WattModalComponent } from '@energinet/watt/modal';
import { WattIconComponent } from '@energinet/watt/icon';
import { VaterStackComponent } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattTooltipDirective } from '@energinet/watt/tooltip';
import { WattFieldErrorComponent } from '@energinet/watt/field';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';

import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import {
  dhMakeFormControl,
  injectRelativeNavigate,
  injectToast,
} from '@energinet-datahub/dh/shared/ui-util';
import {
  EditChargeLinkDocument,
  GetChargeLinkPeriodByIdDocument,
  GetChargeLinkPeriodsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-metering-point-edit-charge-link',
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    WATT_MODAL,
    WattButtonComponent,
    WattTextFieldComponent,
    WattDatepickerComponent,
    VaterStackComponent,
    WattIconComponent,
    WattTooltipDirective,
    WattFieldErrorComponent,
  ],
  styles: `
    :host {
      form > * {
        width: 50%;
      }
    }
  `,
  template: `
    <watt-modal
      size="small"
      #edit
      autoOpen
      *transloco="let t; prefix: 'meteringPoint.chargeLinks.edit'"
      (closed)="navigate('..')"
    >
      <h2 class="watt-modal-title watt-modal-title-icon">
        {{ t('title') }}
        <watt-icon [style.color]="'black'" name="info" [wattTooltip]="t('tooltip')" />
      </h2>
      <form
        id="edit"
        (ngSubmit)="save()"
        vater-stack
        align="start"
        direction="column"
        gap="s"
        tabindex="-1"
        [formGroup]="form"
      >
        @if (chargeType() === 'SUBSCRIPTION') {
          <watt-datepicker
            [formControl]="form.controls.startDate"
            [label]="t('startDate')"
            [min]="min()"
            [max]="max()"
          />
        }
        <watt-text-field [formControl]="form.controls.factor" [label]="t('factor')">
          @if (form.controls.factor.errors?.min) {
            <watt-field-error>
              {{ t('errors.factorMin', { min: form.controls.factor.errors?.min.min }) }}
            </watt-field-error>
          }
        </watt-text-field>
      </form>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="edit.close(false)">
          {{ t('close') }}
        </watt-button>
        <watt-button variant="primary" type="submit" formId="edit">
          {{ t('save') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export default class DhMeteringPointEditChargeLink {
  private readonly toast = injectToast('meteringPoint.chargeLinks.edit.toast');
  private readonly edit = mutation(EditChargeLinkDocument);
  private readonly modal = viewChild.required(WattModalComponent);
  protected navigate = injectRelativeNavigate();
  protected effect = effect(() => this.toast(this.edit.status()));

  form = new FormGroup({
    factor: dhMakeFormControl<string>(null, [Validators.required, Validators.min(1)]),
    startDate: dhMakeFormControl<Date>(null, [Validators.required]),
  });

  id = input.required<string>();
  meteringPointId = input.required<string>();

  period = query(GetChargeLinkPeriodByIdDocument, () => ({ variables: { id: this.id() } }));
  min = computed(() => this.period.data()?.chargeLinkPeriodById?.period?.start);
  max = computed(() => this.period.data()?.chargeLinkPeriodById?.period?.end ?? undefined);
  chargeType = computed(() => this.period.data()?.chargeLinkPeriodById?.charge.type);
  updateStartDateEffect = effect(() => this.form.controls.startDate.setValue(this.min() ?? null));

  save = async () => {
    if (this.form.invalid) return;

    assertIsDefined(this.form.value.startDate);
    assertIsDefined(this.form.value.factor);

    await this.edit.mutate({
      variables: {
        id: this.id(),
        newStartDate: this.form.value.startDate,
        factor: parseInt(this.form.value.factor),
      },
      update: (cache, { data }) => {
        const periods = data?.editChargeLink?.chargeLinkPeriod;
        if (!periods) return;
        cache.updateQuery(
          {
            query: GetChargeLinkPeriodsDocument,
            variables: { meteringPointId: this.meteringPointId() },
          },
          (existing) => {
            if (!existing) return existing;
            const newPeriods = periods.filter(
              (p) => !existing.chargeLinkPeriods.some((e) => e.id === p.id)
            );
            if (newPeriods.length === 0) return existing;
            return {
              ...existing,
              chargeLinkPeriods: [...existing.chargeLinkPeriods, ...newPeriods].sort((a, b) =>
                a.sortKey.localeCompare(b.sortKey)
              ),
            };
          }
        );
      },
    });

    this.modal().close(true);
  };
}
