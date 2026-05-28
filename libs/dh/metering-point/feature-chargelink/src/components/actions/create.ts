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
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  input,
  model,
  inject,
  effect,
  computed,
  Component,
  ViewEncapsulation,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslocoDirective } from '@jsverse/transloco';

import { contains } from '@energinet/watt/core/date';
import { WATT_MODAL, WattModalComponent } from '@energinet/watt/modal';
import { WattIconComponent } from '@energinet/watt/icon';
import { VaterStackComponent } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattTooltipDirective } from '@energinet/watt/tooltip';
import { WattFieldErrorComponent } from '@energinet/watt/field';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet/watt/dropdown';

import { getPath } from '@energinet-datahub/dh/core/configuration-routing';
import {
  dhFormControlToSignal,
  dhMakeFormControl,
  injectToast,
} from '@energinet-datahub/dh/shared/ui-util';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import { DhChargesTypeSelection } from '@energinet-datahub/dh/charges/feature-ui-shared';

import {
  ChargeType,
  GetChargeByTypeDocument,
  CreateChargeLinkDocument,
  GetChargeLinkPeriodsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

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
    WattFieldErrorComponent,
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
      size="small"
      autoOpen
      (closed)="onClosed($event)"
      *transloco="let t; prefix: 'meteringPoint.chargeLinks.create'"
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
            id="create-charge-link-form"
            [formGroup]="form()"
            (ngSubmit)="createLink()"
          >
            <watt-datepicker [formControl]="form().controls.startDate" [label]="t('startDate')" />
            <watt-dropdown
              [formControl]="form().controls.chargeId"
              [options]="chargeOptions()"
              [label]="t('chargeTypes.' + selectedType())"
            />

            @if (selectedType() !== 'TARIFF' && selectedType() !== 'TARIFF_TAX') {
              <watt-text-field [formControl]="form().controls.factor" [label]="t('factor')">
                @if (form().controls.factor.errors?.min) {
                  <watt-field-error>
                    {{ t('errors.factorMin', { min: form().controls.factor.errors?.min.min }) }}
                  </watt-field-error>
                }
              </watt-text-field>
            }
          </form>
        }
      </dh-charges-type-selection>
      <watt-modal-actions>
        @if (!selectedType()) {
          <watt-button variant="secondary" (click)="modal().close(false)">
            {{ t('close') }}
          </watt-button>
        } @else {
          <watt-button variant="secondary" (click)="selectedType.set(null)">
            {{ t('back') }}
          </watt-button>
          <watt-button
            variant="primary"
            type="submit"
            formId="create-charge-link-form"
            [disabled]="createChargeLink.loading()"
          >
            {{ t('actions.' + selectedType()) }}
          </watt-button>
        }
      </watt-modal-actions>
    </watt-modal>
  `,
})
export default class DhMeteringPointCreateChargeLink {
  readonly meteringPointId = input.required<string>();
  readonly selectedType = model<ChargeType | null>(null);
  readonly modal = viewChild.required(WattModalComponent);

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private chargesQuery = query(GetChargeByTypeDocument, () => {
    const type = this.selectedType();
    return type ? { variables: { type } } : { skip: true };
  });

  protected createChargeLink = mutation(CreateChargeLinkDocument, {
    onCompleted: () => this.modal().close(true),
    onStatusUpdated: injectToast('meteringPoint.chargeLinks.create.toast'),
    update: (cache, { data }) => {
      const period = data?.createChargeLink?.chargeLinkPeriod;
      const meteringPointId = this.meteringPointId();
      if (!period) return;
      cache.updateQuery(
        { query: GetChargeLinkPeriodsDocument, variables: { meteringPointId } },
        (existing) => {
          if (!existing) return null;
          const periods = [period, ...existing.chargeLinkPeriods.filter((p) => p.id !== period.id)];
          return {
            ...existing,
            chargeLinkPeriods: periods.sort((a, b) => a.sortKey.localeCompare(b.sortKey)),
          };
        }
      );
    },
  });

  protected form = computed(
    () =>
      new FormGroup({
        chargeId: dhMakeFormControl('', Validators.required),
        startDate: dhMakeFormControl<Date>(null, Validators.required),
        factor: dhMakeFormControl<string>(
          null,
          this.selectedType() !== 'TARIFF' && this.selectedType() !== 'TARIFF_TAX'
            ? [Validators.required, Validators.min(1)]
            : []
        ),
      })
  );

  protected selectedDate = dhFormControlToSignal(() => this.form().controls.startDate);
  protected resetChargeIdOnDateChangeEffect = effect(() => {
    this.selectedDate();
    this.form().controls.chargeId.reset();
  });

  protected chargeOptions = computed<WattDropdownOptions>(() => {
    const opts = this.chargesQuery.data()?.chargesByType ?? [];
    const date = this.selectedDate();
    return !date ? [] : opts.filter((o) => o.periods.some(({ period: p }) => contains(p, date)));
  });

  protected async createLink() {
    const { chargeId, startDate, factor } = this.form().getRawValue();
    assertIsDefined(chargeId);
    assertIsDefined(startDate);
    await this.createChargeLink.mutate({
      variables: {
        chargeId,
        meteringPointId: this.meteringPointId(),
        newStartDate: startDate,
        factor: parseInt(factor ?? '1', 10),
      },
    });
  }

  protected onClosed(created: boolean) {
    const path = created
      ? { outlets: { create: null, primary: this.getRedirectPath() } }
      : { outlets: { create: null } };

    this.router.navigate([path], { relativeTo: this.route.parent });
  }

  private getRedirectPath = () => {
    const createdPeriod = this.createChargeLink.data()?.createChargeLink.chargeLinkPeriod;
    if (!createdPeriod) return null;
    const id = createdPeriod.id;
    const type = createdPeriod.charge.type;
    switch (type) {
      case 'FEE':
        return [getPath('fees'), id];
      case 'SUBSCRIPTION':
      case 'TARIFF':
      case 'TARIFF_TAX':
      case null:
        return [getPath('tariff-and-subscription'), id];
    }
  };
}
