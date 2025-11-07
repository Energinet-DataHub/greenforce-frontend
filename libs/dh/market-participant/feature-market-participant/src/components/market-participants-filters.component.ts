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
import { ChangeDetectionStrategy, Component, inject, output, effect } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { WattButtonComponent } from '@energinet/watt/button';
import { WattDropdownComponent } from '@energinet/watt/dropdown';
import {
  MarketParticipantStatus,
  EicFunction,
  GetPaginatedMarketParticipantsQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet/watt/vater';
import { WattQueryParamsDirective } from '@energinet/watt/query-params';

import { exists } from '@energinet-datahub/dh/shared/util-operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VaterSpacerComponent,
    VaterStackComponent,
    WattButtonComponent,
    WattDropdownComponent,
    WattQueryParamsDirective,
    DhDropdownTranslatorDirective,
  ],
  selector: 'dh-market-participants-filters',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `
    <form
      vater-stack
      scrollable
      direction="row"
      gap="s"
      tabindex="-1"
      [formGroup]="form"
      wattQueryParams
      *transloco="let t; prefix: 'marketParticipant.actorsOverview.filters'"
    >
      <watt-dropdown
        dhDropdownTranslator
        translateKey="marketParticipant.status"
        [formControl]="form.controls.marketParticipantStatuses"
        [options]="marketParticipantStatusOptions"
        [multiple]="true"
        [chipMode]="true"
        [placeholder]="t('status')"
      />

      <watt-dropdown
        dhDropdownTranslator
        translateKey="marketParticipant.marketRoles"
        [formControl]="form.controls.marketRoles"
        [options]="marketRolesOptions"
        [multiple]="true"
        [chipMode]="true"
        [placeholder]="t('marketRole')"
      />

      <vater-spacer />
      <watt-button size="small" variant="primary" icon="close" type="reset">
        {{ t('reset') }}
      </watt-button>
    </form>
  `,
})
export class DhMarketParticipantsFiltersComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  filter = output<GetPaginatedMarketParticipantsQueryVariables>();

  marketParticipantStatusOptions = dhEnumToWattDropdownOptions(MarketParticipantStatus, [
    MarketParticipantStatus.New,
    MarketParticipantStatus.Passive,
  ]);

  marketRolesOptions = dhEnumToWattDropdownOptions(EicFunction);

  form = this.fb.group({
    marketParticipantStatuses: dhMakeFormControl<MarketParticipantStatus[]>(null),
    marketRoles: dhMakeFormControl<EicFunction[]>(null),
  });

  values = toSignal<GetPaginatedMarketParticipantsQueryVariables>(
    this.form.valueChanges.pipe(
      startWith(null),
      map(() => this.form.getRawValue()),
      exists(),
      map(({ marketParticipantStatuses, marketRoles }) => ({
        eicFunctions: marketRoles,
        statuses: marketParticipantStatuses,
      }))
    ),
    { requireSync: true }
  );

  constructor() {
    effect(() => this.filter.emit(this.values()));
  }
}
