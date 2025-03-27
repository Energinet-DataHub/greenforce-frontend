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
import {
  inject,
  Component,
  ChangeDetectionStrategy,
  output,
  effect,
  computed,
} from '@angular/core';
import { map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RxPush } from '@rx-angular/template/push';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattDateRangeChipComponent, WattFormChipDirective } from '@energinet-datahub/watt/chip';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';

import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';

import {
  DocumentStatus,
  EicFunction,
  ExchangeEventCalculationType,
  EsettTimeSeriesType,
  GetOutgoingMessagesQueryVariables,
  GetGridAreasDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { getActorOptions } from '@energinet-datahub/dh/shared/data-access-graphql';
import { WattQueryParamsDirective } from '@energinet-datahub/watt/query-params';

import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { dayjs, WattRange } from '@energinet-datahub/watt/date';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

@Component({
  selector: 'dh-outgoing-messages-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }

      form {
        flex-wrap: wrap;
      }
    `,
  ],
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    RxPush,

    VaterSpacerComponent,
    VaterStackComponent,
    WattButtonComponent,
    WattDateRangeChipComponent,
    WattFormChipDirective,
    WattDropdownComponent,
    WattQueryParamsDirective,
    DhDropdownTranslatorDirective,
  ],
  template: `
    <form
      vater-stack
      direction="row"
      gap="s"
      tabindex="-1"
      [formGroup]="form"
      wattQueryParams
      *transloco="let t; read: 'eSett.outgoingMessages.filters'"
    >
      <watt-dropdown
        [formControl]="form.controls.calculationType"
        [chipMode]="true"
        [options]="calculationTypeOptions"
        [placeholder]="t('calculationType')"
        dhDropdownTranslator
        translateKey="eSett.outgoingMessages.shared.calculationType"
      />

      <watt-dropdown
        [formControl]="form.controls.messageTypes"
        [chipMode]="true"
        [options]="messageTypeOptions"
        [placeholder]="t('messageType')"
        sortDirection="asc"
        dhDropdownTranslator
        translateKey="eSett.outgoingMessages.shared.messageType"
      />

      <watt-dropdown
        [formControl]="form.controls.gridAreas"
        [chipMode]="true"
        [multiple]="true"
        sortDirection="asc"
        [options]="gridAreaOptions()"
        [placeholder]="t('gridArea')"
      />

      <watt-dropdown
        [formControl]="form.controls.actorNumber"
        [chipMode]="true"
        [options]="energySupplierOptions$ | push"
        [placeholder]="t('energySupplier')"
      />

      <watt-dropdown
        [formControl]="form.controls.statuses"
        [chipMode]="true"
        [multiple]="true"
        [options]="documentStatusOptions"
        [placeholder]="t('status')"
        dhDropdownTranslator
        translateKey="eSett.outgoingMessages.shared.documentStatus"
      />

      <watt-date-range-chip [showActions]="true" [formControl]="form.controls.period">{{
        t('period')
      }}</watt-date-range-chip>

      <watt-date-range-chip [showActions]="true" [formControl]="form.controls.created">{{
        t('created')
      }}</watt-date-range-chip>

      <watt-date-range-chip [showActions]="true" [formControl]="form.controls.latestDispatch">{{
        t('latestDispatch')
      }}</watt-date-range-chip>

      <vater-spacer />
      <watt-button variant="text" icon="undo" type="reset" (click)="resetFilters.emit()">
        {{ t('reset') }}
      </watt-button>
    </form>
  `,
})
export class DhOutgoingMessagesFiltersComponent {
  private gridAreasQuery = query(GetGridAreasDocument);
  private fb = inject(NonNullableFormBuilder);

  filter = output<GetOutgoingMessagesQueryVariables>();
  resetFilters = output<void>();

  calculationTypeOptions = dhEnumToWattDropdownOptions(ExchangeEventCalculationType);
  messageTypeOptions = dhEnumToWattDropdownOptions(EsettTimeSeriesType);
  gridAreaOptions = computed(
    () =>
      this.gridAreasQuery.data()?.gridAreas.map((x) => ({
        value: x.code,
        displayValue: x.displayName,
      })) ?? []
  );
  energySupplierOptions$ = getActorOptions([EicFunction.EnergySupplier]);
  documentStatusOptions = dhEnumToWattDropdownOptions(DocumentStatus);

  form = this.fb.group({
    calculationType: new FormControl<ExchangeEventCalculationType | null>(null),
    messageTypes: new FormControl<EsettTimeSeriesType | null>(null),
    gridAreas: new FormControl<string[] | null>(null),
    actorNumber: new FormControl<string | null>(null),
    statuses: new FormControl<DocumentStatus[] | null>(null),
    period: new FormControl<WattRange<Date> | null>(null),
    created: new FormControl<WattRange<Date>>({
      start: dayjs(new Date()).startOf('day').subtract(3, 'days').toDate(),
      end: dayjs(new Date()).endOf('day').toDate(),
    }),
    latestDispatch: new FormControl<WattRange<Date> | null>(null),
  });

  values = toSignal<GetOutgoingMessagesQueryVariables>(
    this.form.valueChanges.pipe(
      startWith(null),
      map(() => this.form.getRawValue()),
      exists(),
      map(
        ({
          actorNumber,
          calculationType,
          created,
          gridAreas,
          latestDispatch,
          messageTypes,
          period,
          statuses,
        }): GetOutgoingMessagesQueryVariables => ({
          actorNumber,
          calculationType,
          createdInterval: created,
          gridAreaCodes: gridAreas,
          sentInterval: latestDispatch,
          documentStatuses: statuses,
          periodInterval: period,
          timeSeriesType: messageTypes,
        })
      )
    ),
    { requireSync: true }
  );

  constructor() {
    effect(() => this.filter.emit(this.values()));
  }
}
