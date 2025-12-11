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
import { Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { translate, TranslocoDirective } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WattTypedModal, WATT_MODAL } from '@energinet/watt/modal';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattTooltipDirective } from '@energinet/watt/tooltip';
import { VaterStackComponent } from '@energinet/watt/vater';
import { WattToastService } from '@energinet/watt/toast';
import { dayjs } from '@energinet/watt/date';

import {
  RequestConnectionStateChangeDocument,
  ConnectionState,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';

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
          [loading]="loading()"
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
  currentCreatedDate: Date;
  meteringPointId: string;
}> {
  private readonly mutation = mutation(RequestConnectionStateChangeDocument);
  private readonly toastService = inject(WattToastService);

  today = new Date();
  minDate = this.findMinDate();

  form = new FormGroup({
    state: dhMakeFormControl<ConnectionState>(this.modalData.currentConnectionState),
    validityDate: dhMakeFormControl<Date>(this.today, Validators.required),
  });

  stateControlOptions = dhEnumToWattDropdownOptions(ConnectionState, this.statesToExclude());
  loading = this.mutation.loading;

  async save() {
    const { validityDate } = this.form.getRawValue();

    const result = await this.mutation.mutate({
      variables: {
        input: {
          meteringPointId: this.modalData.meteringPointId,
          validityDate,
        },
      },
    });

    if (result.data?.requestConnectionStateChange.success) {
      this.toastService.open({
        message: translate('meteringPoint.changeConnectionState.saveSuccess'),
        type: 'success',
      });

      this.dialogRef.close(true);
    }
  }

  private findMinDate() {
    const daysSinceCreated = dayjs(this.today).diff(
      dayjs(this.modalData.currentCreatedDate),
      'days'
    );
    const maxDaysBackInTime = 7;

    if (daysSinceCreated < maxDaysBackInTime) {
      return this.modalData.currentCreatedDate;
    }

    return dayjs(this.today).subtract(maxDaysBackInTime, 'days').toDate();
  }

  private statesToExclude(): ConnectionState[] | undefined {
    if (this.modalData.currentConnectionState === ConnectionState.New) {
      return [ConnectionState.NotUsed, ConnectionState.ClosedDown, ConnectionState.Disconnected];
    }

    return undefined;
  }
}
