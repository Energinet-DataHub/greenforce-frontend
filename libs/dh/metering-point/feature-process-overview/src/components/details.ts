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
import { Component, computed, inject, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { WATT_DESCRIPTION_LIST } from '@energinet-datahub/watt/description-list';
import { WATT_DRAWER } from '@energinet-datahub/watt/drawer';
import { DhProcessStateBadge } from '@energinet-datahub/dh/wholesale/shared'; // TODO: Move to shared
import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { GetMeteringPointProcessByIdDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhMeteringPointProcessOverviewSteps } from './steps';
import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { WattDatePipe } from '@energinet-datahub/watt/date';

@Component({
  selector: 'dh-metering-point-process-overview-details',
  imports: [
    TranslocoDirective,
    WATT_DESCRIPTION_LIST,
    WATT_DRAWER,
    WattDatePipe,
    DhEmDashFallbackPipe,
    DhProcessStateBadge,
    DhMeteringPointProcessOverviewSteps,
  ],
  template: `
    <watt-drawer autoOpen [key]="id()" (closed)="navigation.navigate('list')">
      <watt-drawer-topbar>
        <dh-process-state-badge [status]="state()" *transloco="let t; prefix: 'shared.states'">
          {{ t(state() ?? 'indeterminate') }}
        </dh-process-state-badge>
      </watt-drawer-topbar>
      <watt-drawer-heading>
        <h3 *transloco="let t; prefix: 'messageArchive'">
          {{ documentType() && t('documentType.' + documentType()) | dhEmDashFallback }}
        </h3>
        <watt-description-list
          [groupsPerRow]="4"
          *transloco="let t; prefix: 'meteringPoint.processOverview.details.list'"
        >
          <watt-description-list-item
            [label]="t('createdAt')"
            [value]="createdAt() | wattDate: 'long'"
          />
          <watt-description-list-item
            [label]="t('cutoff')"
            [value]="cutoffDate() | wattDate: 'long'"
          />
          <watt-description-list-item [label]="t('reasonCode')" [value]="reasonCode()" />
          <watt-description-list-item [label]="t('initiator')" [value]="initiator()" />
        </watt-description-list>
      </watt-drawer-heading>
      <watt-drawer-content>
        <dh-metering-point-process-overview-steps [steps]="steps()" [loading]="process.loading()" />
      </watt-drawer-content>
    </watt-drawer>
  `,
})
export class DhMeteringPointProcessOverviewDetails {
  readonly id = input.required<string>();
  protected navigation = inject(DhNavigationService);
  process = query(GetMeteringPointProcessByIdDocument, () => ({
    fetchPolicy: 'cache-and-network',
    returnPartialData: true,
    variables: {
      id: this.id(),
    },
  }));

  state = computed(() => this.process.data()?.meteringPointProcessById?.state);
  createdAt = computed(() => this.process.data()?.meteringPointProcessById?.createdAt);
  cutoffDate = computed(() => this.process.data()?.meteringPointProcessById?.cutoffDate);
  documentType = computed(() => this.process.data()?.meteringPointProcessById?.documentType);
  reasonCode = computed(() => this.process.data()?.meteringPointProcessById?.reasonCode);
  initiator = computed(() => this.process.data()?.meteringPointProcessById?.initiator?.displayName);
  steps = computed(() => this.process.data()?.meteringPointProcessById?.steps ?? []);
}
