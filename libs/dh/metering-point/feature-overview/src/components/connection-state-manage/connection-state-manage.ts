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
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { translate, TranslocoDirective } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WattTypedModal, WATT_MODAL } from '@energinet/watt/modal';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattTooltipDirective } from '@energinet/watt/tooltip';
import { WattToastService } from '@energinet/watt/toast';
import { dayjs } from '@energinet/watt/date';

import {
  RequestConnectionStateChangeDocument,
  RequestConnectionStateChangeMutation,
  GetMeteringPointProcessOverviewDocument,
  ElectricityMarketViewConnectionState,
  ElectricityMarketMeteringPointType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhFormControlToSignal,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { mutation, MutationResult } from '@energinet-datahub/dh/shared/util-apollo';

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
    WattIconComponent,
    WattTooltipDirective,
    DhDropdownTranslatorDirective,
  ],
  styles: `
    form {
      width: 50%;
    }
  `,
  template: `
    <watt-modal #modal *transloco="let t; prefix: 'meteringPoint.changeConnectionState'">
      <h2 class="watt-modal-title watt-modal-title-icon">
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
          dhDropdownTranslator
          translateKey="meteringPoint.overview.status"
        />

        @if (!isCurrentStatusSameAsNew) {
          <watt-datepicker
            [label]="t('validityDate')"
            [formControl]="form.controls.validityDate"
            [min]="minDate()"
            [max]="maxDate"
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
  currentConnectionState: ElectricityMarketViewConnectionState;
  currentCreatedDate: Date;
  meteringPointId: string;
  meteringPointType: ElectricityMarketMeteringPointType;
}> {
  private readonly mutation = mutation(RequestConnectionStateChangeDocument);
  private readonly toastService = inject(WattToastService);

  private today = dayjs().startOf('day').toDate();
  private yesterday = dayjs(this.today).subtract(1, 'day').toDate();

  loading = this.mutation.loading;

  form = new FormGroup({
    state: dhMakeFormControl<ElectricityMarketViewConnectionState>(
      this.modalData.currentConnectionState
    ),
    validityDate: dhMakeFormControl<Date>(this.today, Validators.required),
  });

  private stateChange = dhFormControlToSignal(this.form.controls.state);

  maxDate = this.today;
  minDate = computed(() => this.findMinDate(this.stateChange()));

  stateControlOptions = dhEnumToWattDropdownOptions(this.statesToShow());

  async save() {
    const { validityDate } = this.form.getRawValue();

    const result = await this.mutation.mutate({
      variables: {
        input: {
          meteringPointId: this.modalData.meteringPointId,
          currentConnectionState: this.modalData.currentConnectionState,
          newConnectionState: this.form.controls.state.value,
          validityDate,
        },
      },
      refetchQueries: ({ data }) => {
        if (this.isUpdateSuccessful(data)) {
          return [GetMeteringPointProcessOverviewDocument];
        }

        return [];
      },
    });

    if (this.isUpdateSuccessful(result.data)) {
      this.toastService.open({
        message: translate('meteringPoint.changeConnectionState.saveSuccess'),
        type: 'success',
      });

      this.dialogRef.close(true);
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private findMinDate(newConnectionState: ElectricityMarketViewConnectionState): Date {
    const daysSinceCreated = dayjs(this.today).diff(
      dayjs(this.modalData.currentCreatedDate),
      'days'
    );

    // Handle DISCONNECTED -> CONNECTED transition
    if (this.modalData.currentConnectionState === 'DISCONNECTED') {
      if (newConnectionState === 'CONNECTED') {
        return this.yesterday;
      }
    }

    switch (newConnectionState) {
      // Handle NEW -> CONNECTED transition
      case 'CONNECTED': {
        const maxDaysBackInTime = 7;

        if (daysSinceCreated < maxDaysBackInTime) {
          return this.modalData.currentCreatedDate;
        }

        return dayjs(this.today).subtract(maxDaysBackInTime, 'days').toDate();
      }
      // Handle CONNECTED -> DISCONNECTED transition
      case 'DISCONNECTED': {
        return this.yesterday;
      }
      // Handle NEW -> CLOSED_DOWN and
      // Handle CONNECTED -> CLOSED_DOWN and
      // Handle DISCONNECTED -> CLOSED_DOWN transitions
      case 'CLOSED_DOWN': {
        const maxDaysBackInTime =
          this.modalData.meteringPointType === ElectricityMarketMeteringPointType.ElectricalHeating
            ? 23
            : 1;

        if (daysSinceCreated < maxDaysBackInTime) {
          return this.modalData.currentCreatedDate;
        }

        return dayjs(this.today).subtract(maxDaysBackInTime, 'days').toDate();
      }
      default:
        return this.today;
    }
  }

  private statesToShow(): Partial<{
    [K in keyof typeof ElectricityMarketViewConnectionState]: (typeof ElectricityMarketViewConnectionState)[K];
  }> {
    switch (this.modalData.currentConnectionState) {
      case 'NEW':
        return {
          New: 'NEW',
          Connected: 'CONNECTED',
          ClosedDown: 'CLOSED_DOWN',
        };
      case 'CONNECTED':
        return {
          Connected: 'CONNECTED',
          Disconnected: 'DISCONNECTED',
          ClosedDown: 'CLOSED_DOWN',
        };
      case 'DISCONNECTED':
        return {
          Disconnected: 'DISCONNECTED',
          Connected: 'CONNECTED',
          ClosedDown: 'CLOSED_DOWN',
        };
      default:
        return {};
    }
  }

  private isUpdateSuccessful(
    mutationResult: MutationResult<RequestConnectionStateChangeMutation>['data']
  ) {
    return mutationResult?.requestConnectionStateChange.success;
  }
}
