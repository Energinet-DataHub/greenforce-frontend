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

import { Component, inject, input, ViewEncapsulation } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';

import { WATT_MODAL } from '@energinet/watt/modal';
import { VaterStackComponent } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattTextFieldComponent } from '@energinet/watt/text-field';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';

import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { EditChargeLinkDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattTooltipDirective } from '@energinet/watt/tooltip';

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
      [title]="t('title')"
      (closed)="save($event)"
    >
      <h2 vater-stack direction="row" gap="s">
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
  private edit = mutation(EditChargeLinkDocument);
  navigate = inject(DhNavigationService);
  form = new FormGroup({
    factor: dhMakeFormControl<number>(null, [Validators.min(1)]),
    startDate: dhMakeFormControl<Date>(null, [Validators.required]),
  });

  id = input.required<string>();

  save = async (save: boolean) => {
    if (!save) return this.navigate.navigate('details', this.id());

    const startDate = this.form.value.startDate;
    const factor = this.form.value.factor;
    if (this.form.invalid) return;
    if (!startDate) return;
    if (!factor) return;

    await this.edit.mutate({
      variables: {
        chargeLinkId: this.id(),
        newStartDate: startDate,
        factor,
      },
    });

    this.navigate.navigate('details', this.id());
  };
}
