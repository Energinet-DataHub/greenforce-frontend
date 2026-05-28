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

import { Component, input, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';

import { WATT_MODAL, WattModalComponent } from '@energinet/watt/modal';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattTooltipDirective } from '@energinet/watt/tooltip';

import { injectRelativeNavigate, injectToast } from '@energinet-datahub/dh/shared/ui-util';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { CancelChargeLinkDocument } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-metering-point-cancel-charge-link',
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    WATT_MODAL,
    WattButtonComponent,
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
      #modal
      autoOpen
      *transloco="let t; prefix: 'meteringPoint.chargeLinks.cancel'"
      (closed)="navigate('..')"
    >
      <h2 class="watt-modal-title watt-modal-title-icon">
        {{ t('title') }}
        <watt-icon [style.color]="'black'" name="info" [wattTooltip]="t('tooltip')" />
      </h2>
      {{ t('cancelWarning') }}
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">
          {{ t('close') }}
        </watt-button>
        <watt-button
          variant="secondary"
          (click)="cancel.mutate({ variables: { id: id() } })"
          [disabled]="cancel.loading()"
        >
          {{ t('cancel') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export default class DhMeteringPointCancelChargeLink {
  readonly id = input.required<string>();
  readonly modal = viewChild.required(WattModalComponent);
  protected navigate = injectRelativeNavigate();
  protected toast = injectToast('meteringPoint.chargeLinks.cancel.toast');
  protected cancel = mutation(CancelChargeLinkDocument, {
    onCompleted: () => this.modal().close(true),
    onStatusUpdated: this.toast,
  });
}
