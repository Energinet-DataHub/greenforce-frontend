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
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';

import { VaterStackComponent } from '@energinet/watt/vater';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattCheckboxComponent } from '@energinet/watt/checkbox';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet/watt/description-list';
import { WattDatePipe } from '@energinet/watt/date';

@Component({
  selector: 'dh-actor-conversation-electrical-heating-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VaterStackComponent,
    WattDatepickerComponent,
    WattCheckboxComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattDatePipe,
  ],
  styles: `
    h3 {
      margin: 0;
    }

    watt-datepicker {
      width: auto;
    }
  `,
  template: `
    <vater-stack
      gap="s"
      *transloco="let t; prefix: 'meteringPoint.actorConversation.electricalHeatingForm'"
      align="start"
    >
      <h3>{{ t('title') }}</h3>

      <watt-description-list variant="compact">
        <watt-description-list-item
          [label]="t('currentElectricalHeatingStatus')"
          [value]="t('yes')"
        />
        <watt-description-list-item
          [label]="t('electricalHeatingDate')"
          [value]="newDate | wattDate: 'long'"
        />
        <watt-description-list-item [label]="t('customer')" value="Fornavn Efternavn" />
        <watt-description-list-item
          [label]="t('supplierInPeriod')"
          [value]="newDate | wattDate: 'long'"
        />
        <watt-description-list-item
          [label]="t('currentElectricalHeatingStatus')"
          [value]="t('yes')"
        />
      </watt-description-list>

      <watt-datepicker
        [label]="t('addressEligibilityDate')"
        [formControl]="form.controls.addressEligibilityDate"
      />

      <span class="watt-label">{{ t('periodTitle') }}</span>
      <vater-stack direction="row" gap="m">
        <watt-datepicker [label]="t('periodStart')" [formControl]="form.controls.periodStart" />
        <watt-datepicker [label]="t('periodEnd')" [formControl]="form.controls.periodEnd" />
      </vater-stack>

      <vater-stack gap="s" align="start">
        <watt-checkbox [formControl]="form.controls.attachedBbrNotification">
          {{ t('attachedBbrNotification') }}
        </watt-checkbox>
        <watt-checkbox [formControl]="form.controls.attachedBbrDocumentation">
          {{ t('attachedBbrDocumentation') }}
        </watt-checkbox>
      </vater-stack>
    </vater-stack>
  `,
})
export class DhActorConversationElectricalHeatingFormComponent {
  newDate = new Date();
  form = new FormGroup({
    addressEligibilityDate: new FormControl<Date | null>(null, Validators.required),
    periodStart: new FormControl<Date | null>(null, Validators.required),
    periodEnd: new FormControl<Date | null>(null),
    attachedBbrNotification: new FormControl<boolean>(false, { nonNullable: true }),
    attachedBbrDocumentation: new FormControl<boolean>(false, { nonNullable: true }),
  });
}
