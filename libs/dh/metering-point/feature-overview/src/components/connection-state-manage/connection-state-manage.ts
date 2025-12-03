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
import { Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WattTypedModal, WATT_MODAL } from '@energinet/watt/modal';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { dayjs } from '@energinet/watt/date';

import { ConnectionState } from '@energinet-datahub/dh/shared/domain/graphql';
import { dhEnumToWattDropdownOptions } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-connection-state-manage',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_MODAL,
    WattButtonComponent,
    WattDropdownComponent,
    WattDatepickerComponent,
  ],
  template: `
    <watt-modal
      #modal
      [title]="t('modalTitle')"
      *transloco="let t; prefix: 'meteringPoint.changeConnectionState'"
    >
      <watt-dropdown
        [label]="t('connectionStateLabel')"
        [formControl]="stateControl"
        [showResetOption]="false"
        [options]="stateControlOptions"
      />

      @if (modalData.currentConnectionState !== stateControl.value) {
        <watt-datepicker
          [label]="t('validityDate')"
          [formControl]="validityDateControl"
          [min]="minDate"
          [max]="today"
        />
      }

      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">
          {{ t('cancel') }}
        </watt-button>

        <watt-button (click)="save()">
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

  stateControl = new FormControl<ConnectionState>(this.modalData.currentConnectionState);
  validityDateControl = new FormControl<Date>(this.today, {
    validators: [Validators.required],
  });

  stateControlOptions = dhEnumToWattDropdownOptions(ConnectionState, [
    ConnectionState.NotUsed,
    ConnectionState.ClosedDown,
    ConnectionState.Disconnected,
  ]);

  save() {
    console.log('Saving connection state changes...');
  }
}
