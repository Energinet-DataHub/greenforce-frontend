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
import { inject, Component, ChangeDetectionStrategy, output, effect } from '@angular/core';

import { map, startWith } from 'rxjs';

import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { RxPush } from '@rx-angular/template/push';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattFormChipDirective } from '@energinet-datahub/watt/field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattDateRangeChipComponent } from '@energinet-datahub/watt/datepicker';
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
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  getActorOptions,
  getGridAreaOptionsSignal,
} from '@energinet-datahub/dh/shared/data-access-graphql';
import { WattQueryParamsDirective } from '@energinet-datahub/watt/directives';

import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { dayjs, WattRange } from '@energinet-datahub/watt/date';

@Component({
  selector: 'dh-outgoing-messages-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-filters.component.html',
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
})
export class DhOutgoingMessagesFiltersComponent {
  private fb = inject(NonNullableFormBuilder);
  filter = output<GetOutgoingMessagesQueryVariables>();
  resetFilters = output<void>();

  calculationTypeOptions = dhEnumToWattDropdownOptions(ExchangeEventCalculationType);
  messageTypeOptions = dhEnumToWattDropdownOptions(EsettTimeSeriesType);
  gridAreaOptions = getGridAreaOptionsSignal();
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

  reset() {
    this.form.reset();
    this.resetFilters.emit();
  }

  constructor() {
    effect(() => this.filter.emit(this.values()));
  }
}
