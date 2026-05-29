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

import { Component, computed, input, viewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';

import { WattIconComponent } from '@energinet/watt/icon';
import { VaterStackComponent } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattTooltipDirective } from '@energinet/watt/tooltip';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WATT_MODAL, WattModalComponent } from '@energinet/watt/modal';

import { mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import {
  injectToast,
  dhMakeFormControl,
  injectRelativeNavigate,
} from '@energinet-datahub/dh/shared/ui-util';

import {
  GetChargeLinkPeriodByIdDocument,
  StopChargeLinkDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-charge-links-stop-modal',
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    WATT_MODAL,
    WattButtonComponent,
    WattDatepickerComponent,
    VaterStackComponent,
    WattIconComponent,
    WattTooltipDirective,
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
      autoOpen
      *transloco="let t; prefix: 'meteringPoint.chargeLinks.stop'"
      (closed)="navigate('..')"
    >
      <h2 class="watt-modal-title watt-modal-title-icon">
        {{ t('title') }}
        <watt-icon [style.color]="'black'" name="info" [wattTooltip]="t('tooltip')" />
      </h2>
      <form
        id="stop-charge-link-form"
        vater-stack
        align="start"
        direction="column"
        gap="s"
        tabindex="-1"
        [formGroup]="form"
        (ngSubmit)="stop()"
      >
        <watt-datepicker
          [formControl]="form.controls.stopDate"
          [label]="t('stopDate')"
          [min]="min()"
          [max]="max()"
        />
      </form>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal().close(false)">
          {{ t('close') }}
        </watt-button>
        <watt-button variant="primary" formId="stop-charge-link-form" type="submit">
          {{ t('save') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export default class DhChargeLinksStopModal {
  protected navigate = injectRelativeNavigate();

  readonly modal = viewChild.required(WattModalComponent);
  readonly id = input.required<string>();

  period = query(GetChargeLinkPeriodByIdDocument, () => ({ variables: { id: this.id() } }));
  stopChargeLink = mutation(StopChargeLinkDocument, {
    onStatusUpdated: injectToast('meteringPoint.chargeLinks.stop.toast'),
    onCompleted: () => this.modal().close(true),
  });

  form = new FormGroup({
    stopDate: dhMakeFormControl<Date>(null, [Validators.required]),
  });

  min = computed(() => this.period.data()?.chargeLinkPeriodById?.period?.start);
  max = computed(() => this.period.data()?.chargeLinkPeriodById?.period?.end ?? undefined);

  async stop() {
    assertIsDefined(this.form.controls.stopDate.value);
    await this.stopChargeLink.mutate({
      variables: {
        id: this.id(),
        stopDate: this.form.controls.stopDate.value,
      },
    });
  }
}
