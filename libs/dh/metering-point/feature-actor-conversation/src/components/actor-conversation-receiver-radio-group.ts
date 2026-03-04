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
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { VATER } from '@energinet/watt/vater';
import { WATT_RADIO } from '@energinet/watt/radio';
import { ActorType, EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattDatepickerComponent } from '@energinet/watt/datepicker';
import { WattSeparatorComponent } from '@energinet/watt/separator';

@Component({
  selector: 'dh-actor-conversation-receiver-radio-group',
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VATER,
    WATT_RADIO,
    WattDatepickerComponent,
    WattSeparatorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *transloco="let t; prefix: 'meteringPoint.actorConversation'">
      <watt-radio-group
        [label]="t('receiverLabel')"
        [formControl]="receiverControl()"
        data-testid="actor-conversation-receiver-radio-group"
      >
        <vater-stack align="start">
          <watt-radio [value]="actorType.EnergySupplier">
            {{ t('receivers.ENERGY_SUPPLIER') }}
          </watt-radio>
          @if (receiverControl().value === 'ENERGY_SUPPLIER') {
            <vater-stack gap="m" fill="vertical" direction="row" class="watt-space-inset-s">
              <watt-separator weight="bold" orientation="vertical" />
              <watt-datepicker [label]="t('onDate')" [formControl]="dateControl()" />
            </vater-stack>
          }
          @switch (marketRole()) {
            @case ('EnergySupplier') {
              <watt-radio [value]="actorType.GridAccessProvider">
                {{ t('receivers.GRID_ACCESS_PROVIDER') }}
              </watt-radio>
              <watt-radio [value]="actorType.Energinet">
                {{ t('receivers.ENERGINET') }}
              </watt-radio>
            }
            @case ('DataHubAdministrator') {
              <watt-radio [value]="actorType.GridAccessProvider">
                {{ t('receivers.GRID_ACCESS_PROVIDER') }}
              </watt-radio>
            }
            @case ('GridAccessProvider') {
              <watt-radio [value]="actorType.Energinet">
                {{ t('receivers.ENERGINET') }}
              </watt-radio>
            }
          }
        </vater-stack>
      </watt-radio-group>
    </ng-container>
  `,
})
export class DhActorConversationReceiverRadioGroupComponent {
  marketRole = input.required<EicFunction | null | undefined>();
  receiverControl = input.required<FormControl<ActorType | null>>();
  dateControl = input.required<FormControl<Date | null>>();
  actorType = ActorType;
}
