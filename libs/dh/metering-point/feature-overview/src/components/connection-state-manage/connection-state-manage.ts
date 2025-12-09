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
import { Validators, FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WattTypedModal, WATT_MODAL } from '@energinet/watt/modal';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattTooltipDirective } from '@energinet/watt/tooltip';
import { VaterStackComponent } from '@energinet/watt/vater';
import { dayjs } from '@energinet/watt/date';

import { ConnectionState } from '@energinet-datahub/dh/shared/domain/graphql';
import { dhEnumToWattDropdownOptions } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-connection-state-manage',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    VaterStackComponent,
    WATT_MODAL,
    WattButtonComponent,
    WattDropdownComponent,
    WattDatepickerComponent,
    WattIconComponent,
    WattTooltipDirective,
  ],
  styles: `
    form {
      width: 50%;
    }
  `,
  template: `
    <watt-modal #modal *transloco="let t; prefix: 'meteringPoint.changeConnectionState'">
      <h2 vater-stack direction="row" gap="s">
        {{ t('modalTitle') }}
        <watt-icon [style.color]="'black'" name="info" [wattTooltip]="t('tooltip')" />
      </h2>

      @let isCurrentStatusSameAsNew =
        modalData.currentConnectionState === form.controls.state.value;

      <form [formGroup]="form" id="change-connection-state-form" (ngSubmit)="save()">
        <watt-dropdown
          [label]="t('connectionStateLabel')"
          [formControl]="form.controls.state"
          [showResetOption]="false"
          [options]="stateControlOptions"
        />

        @if (!isCurrentStatusSameAsNew) {
          <watt-datepicker
            [label]="t('validityDate')"
            [formControl]="form.controls.validityDate"
            [min]="minDate"
            [max]="today"
          />
        }
      </form>

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">
          {{ t('cancel') }}
        </watt-button>

        <watt-button
          formId="change-connection-state-form"
          [disabled]="isCurrentStatusSameAsNew"
          type="submit"
        >
          {{ t('save') }}
        </watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class DhConnectionStateManageComponent extends WattTypedModal<{
  currentConnectionState: ConnectionState;
}> {
  today = new Date();
  minDate = dayjs(this.today).subtract(7, 'days').toDate();

  form = new FormGroup({
    state: new FormControl<ConnectionState>(this.modalData.currentConnectionState),
    validityDate: new FormControl<Date>(this.today, {
      validators: [Validators.required],
    }),
  });

  stateControlOptions = dhEnumToWattDropdownOptions(ConnectionState, this.statesToExclude());

  private statesToExclude(): ConnectionState[] | undefined {
    if (this.modalData.currentConnectionState === ConnectionState.New) {
      return [ConnectionState.NotUsed, ConnectionState.ClosedDown, ConnectionState.Disconnected];
    }

    return undefined;
  }

  save() {
    console.log('Saving connection state changes...');
  }
}
