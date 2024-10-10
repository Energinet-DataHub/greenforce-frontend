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
import { Component, inject, viewChild, output, computed, effect, input } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WattDrawerComponent, WATT_DRAWER } from '@energinet-datahub/watt/drawer';
import { WATT_PROGRESS_TRACKER } from '@energinet-datahub/watt/progress-tracker';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import {
  CalculationOrchestrationState as State,
  CancelScheduledCalculationDocument,
  GetCalculationByIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { lazyQuery, mutation } from '@energinet-datahub/dh/shared/util-apollo';

import { DhCalculationsGridAreasTableComponent } from '../grid-areas/table.component';
import { VaterFlexComponent, VaterUtilityDirective } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattModalActionsComponent, WattModalComponent } from '@energinet-datahub/watt/modal';

@Component({
  standalone: true,
  imports: [
    TranslocoDirective,

    WATT_DRAWER,
    WATT_PROGRESS_TRACKER,
    WattButtonComponent,
    WattBadgeComponent,
    WattDatePipe,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattEmptyStateComponent,
    WattModalComponent,
    WattModalActionsComponent,
    WattSpinnerComponent,
    VaterFlexComponent,
    VaterUtilityDirective,

    DhCalculationsGridAreasTableComponent,
    DhEmDashFallbackPipe,
  ],
  selector: 'dh-calculations-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DhCalculationsDetailsComponent {
  private toast = inject(WattToastService);
  private transloco = inject(TranslocoService);

  id = input<string>();
  closed = output();

  drawer = viewChild(WattDrawerComponent);
  modal = viewChild.required(WattModalComponent);

  query = lazyQuery(GetCalculationByIdDocument, {
    nextFetchPolicy: 'cache-first',
  });

  result = computed(() => this.query.data()?.calculationById);
  type = computed(() => this.result()?.calculationType ?? 'UNKNOWN');
  executionType = computed(() => this.result()?.executionType);
  statusType = computed(() => this.result()?.statusType ?? 'skeleton');
  state = computed(() => this.result()?.state ?? 'INDETERMINATE');
  isScheduled = computed(() => this.result()?.state === State.Scheduled);

  cancelCalculation = mutation(CancelScheduledCalculationDocument, {
    onCompleted: () =>
      this.toast.update({
        type: 'success',
        message: this.transloco.translate('wholesale.calculations.details.toast.success'),
      }),
    onError: () =>
      this.toast.update({
        type: 'danger',
        message: this.transloco.translate('wholesale.calculations.details.toast.error'),
      }),
  });

  cancelModalClosed = (shouldCancel: boolean) => {
    const calculationId = this.id();
    if (shouldCancel && calculationId) {
      this.toast.open({
        type: 'loading',
        message: this.transloco.translate('wholesale.calculations.details.toast.loading'),
      });

      this.cancelCalculation.mutate({ variables: { input: { calculationId } } });
    }
  };

  constructor() {
    effect(() => {
      const id = this.id();
      const drawer = this.drawer();
      if (!id || !drawer) return;
      this.query.refetch({ id });
      drawer.open();
    });
  }
}
