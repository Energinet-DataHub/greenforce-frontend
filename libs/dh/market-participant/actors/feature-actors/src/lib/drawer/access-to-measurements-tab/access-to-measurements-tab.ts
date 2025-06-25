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
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { VaterFlexComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';
import {
  DhPermissionRequiredDirective,
  PermissionService,
} from '@energinet-datahub/dh/shared/feature-authorization';
import { GetAdditionalRecipientOfMeasurementsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

import { DhSetUpAccessToMeasurements } from './create/set-up-access-to-measurements';
import { DhMeteringPointIdsOverview } from './overview/metering-point-ids-overview';

@Component({
  selector: 'dh-access-to-measurements-tab',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    VaterFlexComponent,
    VaterStackComponent,
    WattButtonComponent,
    WattEmptyStateComponent,
    WattSpinnerComponent,
    DhPermissionRequiredDirective,
    DhMeteringPointIdsOverview,
  ],
  template: `
    <vater-flex *transloco="let t; read: 'marketParticipant.accessToMeasurements'">
      @if (isLoading()) {
        <vater-stack direction="row" justify="center">
          <watt-spinner />
        </vater-stack>
      } @else if (isEmpty()) {
        <vater-stack>
          <watt-empty-state
            [icon]="hasError() ? 'custom-power' : 'custom-no-results'"
            [title]="hasError() ? t('errorTitle') : t('emptyTitle')"
            [message]="hasError() ? t('errorMessage') : t('emptyMessage')"
          >
            @if (hasError() === false) {
              <watt-button
                *dhPermissionRequired="['additional-recipients:manage']"
                (click)="setUpAccessToMeasurements()"
                variant="secondary"
              >
                {{ t('emptyButton') }}
              </watt-button>
            }
          </watt-empty-state>
        </vater-stack>
      } @else {
        <dh-metering-point-ids-overview
          [data]="data()"
          [actorId]="actor().id"
          [canManageAdditionalRecipients]="!!canManageAdditionalRecipients()"
        >
          <watt-button
            *dhPermissionRequired="['additional-recipients:manage']"
            (click)="setUpAccessToMeasurements()"
            variant="secondary"
          >
            {{ t('emptyButton') }}
          </watt-button>
        </dh-metering-point-ids-overview>
      }
    </vater-flex>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class DhAccessToMeasurementsTab {
  private readonly modalService = inject(WattModalService);
  private readonly permissionService = inject(PermissionService);

  private query = query(GetAdditionalRecipientOfMeasurementsDocument, () => ({
    variables: { actorId: this.actor().id },
  }));

  actor = input.required<DhActorExtended>();

  data = computed<string[]>(
    () => this.query.data()?.actorById.additionalRecipientForMeasurements ?? []
  );

  isLoading = this.query.loading;
  hasError = this.query.hasError;
  isEmpty = computed(() => this.data().length === 0);

  canManageAdditionalRecipients = toSignal(
    this.permissionService.hasPermission('additional-recipients:manage')
  );

  setUpAccessToMeasurements(): void {
    this.modalService.open({ component: DhSetUpAccessToMeasurements, data: this.actor() });
  }
}
