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
import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

import { WattButtonComponent } from '@energinet/watt/button';
import { WATT_CARD } from '@energinet/watt/card';
import { VATER } from '@energinet/watt/vater';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import { dayjs } from '@energinet/watt/core/date';

import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
  injectRelativeNavigate,
  injectToast,
} from '@energinet-datahub/dh/shared/ui-util';
import { assertIsDefined } from '@energinet-datahub/dh/shared/util-assert';
import {
  MasterDataReportConnectionStateType,
  MeasurementsReportMeteringPointType,
  RequestMasterDataReportDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { getGridAreaOptionsForPeriodSignal } from '@energinet-datahub/dh/shared/data-access-graphql';
import { DhActorStorage } from '@energinet-datahub/dh/shared/feature-authorization';
import { mutation, MutationStatus } from '@energinet-datahub/dh/shared/util-apollo';

@Component({
  selector: 'dh-metering-point-master-data-report',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    VATER,
    WATT_CARD,
    WattButtonComponent,
    WattDatepickerComponent,
    WattDropdownComponent,
    DhDropdownTranslatorDirective,
  ],
  styles: `
    :host {
      display: block;
    }

    .items-group > * {
      width: 50%;
    }
  `,
  template: `
    <vater-flex
      gap="ml"
      *transloco="let t; prefix: 'reports.overview.newReport.meteringPointMasterData'"
    >
      <watt-card>
        <form
          [formGroup]="form"
          (ngSubmit)="submit()"
          id="master-data-form"
          vater-stack
          align="stretch"
        >
          <div class="items-group">
            <watt-datepicker [label]="t('date')" [formControl]="form.controls.date" />
          </div>

          <div class="items-group">
            <watt-dropdown
              [multiple]="true"
              sortDirection="asc"
              [label]="t('gridArea')"
              [formControl]="form.controls.gridAreas"
              [options]="gridAreaOptions()"
              data-testid="masterDataReport.gridAreas"
            />
          </div>

          <div class="items-group">
            <watt-dropdown
              dhDropdownTranslator
              translateKey="meteringPointType"
              [label]="t('meteringPointTypes')"
              [multiple]="true"
              [formControl]="form.controls.meteringPointTypes"
              [options]="meteringPointTypesOptions"
              data-testid="masterDataReport.meteringPointTypes"
            />
          </div>

          <div class="items-group">
            <watt-dropdown
              dhDropdownTranslator
              translateKey="meteringPoint.overview.status"
              [label]="t('connectionStates')"
              [multiple]="true"
              [formControl]="form.controls.connectionState"
              [options]="connectionStateOptions"
              data-testid="masterDataReport.connectionStates"
            />
          </div>
        </form>
      </watt-card>

      <watt-button
        type="submit"
        formId="master-data-form"
        [block]="true"
        [loading]="reportMutation.loading()"
      >
        {{ t('submit') }}
      </watt-button>
    </vater-flex>
  `,
})
export class DhMeteringPointMasterDataReport {
  private readonly navigation = injectRelativeNavigate();
  private readonly marketParticipantId = inject(DhActorStorage).getSelectedActorId();

  reportMutation = mutation(RequestMasterDataReportDocument, {
    onStatusUpdated: injectToast('reports.overview.newReport.meteringPointMasterData.toast', [
      MutationStatus.Loading,
    ]),
  });

  form = new FormGroup({
    date: dhMakeFormControl<Date | null>(null, Validators.required),
    gridAreas: dhMakeFormControl<string[] | null>(null),
    meteringPointTypes: dhMakeFormControl<MeasurementsReportMeteringPointType[] | null>(null),
    connectionState: dhMakeFormControl<MasterDataReportConnectionStateType[] | null>(null),
  });

  private dateChanges = toSignal(this.form.controls.date.valueChanges);

  private maybePeriod = computed(() => {
    const maybeDate = this.dateChanges();

    if (!maybeDate) {
      return null;
    }

    return {
      start: dayjs(maybeDate).startOf('day').toDate(),
      end: dayjs(maybeDate).endOf('day').toDate(),
    };
  });

  meteringPointTypesOptions = dhEnumToWattDropdownOptions(MeasurementsReportMeteringPointType);
  connectionStateOptions = dhEnumToWattDropdownOptions(MasterDataReportConnectionStateType);

  gridAreaOptions = getGridAreaOptionsForPeriodSignal(this.maybePeriod, this.marketParticipantId);

  gridAreaOptionsEffect = effect(() => {
    const gridAreaOptions = this.gridAreaOptions();

    this.form.controls.gridAreas.setValue(null);

    if (gridAreaOptions.length === 1) {
      this.form.controls.gridAreas.setValue([gridAreaOptions[0].value]);
    }
  });

  async submit() {
    if (this.form.invalid) return;

    const { date, gridAreas, meteringPointTypes, connectionState } = this.form.getRawValue();

    assertIsDefined(date);

    await this.reportMutation.mutate({
      variables: {
        input: {
          date,
          gridAreaIds: gridAreas,
          meteringPointTypes: meteringPointTypes,
          connectionStates: connectionState,
          actorNumberOverride: this.marketParticipantId,
          marketRoleOverride: null,
          userId: null,
        },
      },
      onCompleted: () => this.navigation(['../']),
    });
  }
}
