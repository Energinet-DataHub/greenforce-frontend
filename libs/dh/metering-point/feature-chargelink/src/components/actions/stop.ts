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

import { Component, effect, inject, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';

import { WATT_MODAL } from '@energinet/watt/modal';
import { WattIconComponent } from '@energinet/watt/icon';
import { VaterStackComponent } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattTooltipDirective } from '@energinet/watt/tooltip';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';

import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { injectToast, dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';

import { StopChargeLinkDocument } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-metering-point-stop-charge-link',
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
      #stop
      autoOpen
      *transloco="let t; prefix: 'meteringPoint.chargeLinks.stop'"
      (closed)="stopLink($event)"
    >
      <h2 class="watt-modal-title watt-modal-title-icon">
        {{ t('title') }}
        <watt-icon [style.color]="'black'" name="info" [wattTooltip]="t('tooltip')" />
      </h2>
      <form vater-stack align="start" direction="column" gap="s" tabindex="-1" [formGroup]="form">
        <watt-datepicker [formControl]="form.controls.stopDate" [label]="t('stopDate')" />
      </form>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="stop.close(false)">
          {{ t('close') }}
        </watt-button>
        <watt-button variant="primary" (click)="form.valid && stop.close(true)">
          {{ t('save') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export default class DhMeteringPointStopChargeLink {
  private readonly toast = injectToast('meteringPoint.chargeLinks.stop.toast');
  private readonly stopChargeLink = mutation(StopChargeLinkDocument);
  private readonly navigate = inject(DhNavigationService);
  form = new FormGroup({
    stopDate: dhMakeFormControl<Date>(null, [Validators.required]),
  });

  id = input.required<string>();

  async stopLink(saved: boolean) {
    if (!saved) return this.navigate.navigate('details', this.id());
    assertIsDefined(this.form.controls.stopDate.value);
    await this.stopChargeLink.mutate({
      variables: {
        id: this.id(),
        stopDate: this.form.controls.stopDate.value,
      },
    });

    this.navigate.navigate('details', this.id());
  }

  constructor() {
    effect(() => this.toast(this.stopChargeLink.status()));
  }
}
