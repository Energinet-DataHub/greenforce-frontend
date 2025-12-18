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
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';

import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import { dhMakeFormControl, injectToast } from '@energinet-datahub/dh/shared/ui-util';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { EditChargeLinkDocument } from '@energinet-datahub/dh/shared/domain/graphql';

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
      (closed)="save($event)"
    >
      <h2 class="watt-modal-title watt-modal-title-icon">
        {{ t('title') }}
        <watt-icon [style.color]="'black'" name="info" [wattTooltip]="t('tooltip')" />
      </h2>
      <form vater-stack align="start" direction="column" gap="s" tabindex="-1" [formGroup]="form">
        <watt-text-field [formControl]="form.controls.factor" [label]="t('factor')" type="number" />
        <watt-datepicker [formControl]="form.controls.startDate" [label]="t('startDate')" />
      </form>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="edit.close(false)">
          {{ t('close') }}
        </watt-button>
        <watt-button variant="primary" (click)="edit.close(true)">
          {{ t('save') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export default class DhMeteringPointEditChargeLink {
  private readonly toast = injectToast('meteringPoint.chargeLinks.edit.toast');
  private readonly edit = mutation(EditChargeLinkDocument);
  navigate = inject(DhNavigationService);
  form = new FormGroup({
    factor: dhMakeFormControl<string>(null, [Validators.min(1)]),
    startDate: dhMakeFormControl<Date>(null, [Validators.required]),
  });

  id = input.required<string>();

  save = async (save: boolean) => {
    if (!save) return this.navigate.navigate('details', this.id());

    if (this.form.invalid) return;

    assertIsDefined(this.form.value.startDate);
    assertIsDefined(this.form.value.factor);

    await this.edit.mutate({
      variables: {
        id: this.id(),
        newStartDate: this.form.value.startDate,
        factor: parseInt(this.form.value.factor),
      },
    });

    this.navigate.navigate('details', this.id());
  };

  effect = effect(() => this.toast(this.edit.status()));
}
