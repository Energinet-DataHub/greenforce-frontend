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

@Component({
  selector: 'dh-actor-conversation-receiver-radio-group',
  imports: [ReactiveFormsModule, TranslocoDirective, VATER, WATT_RADIO, WattDatepickerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *transloco="let t; prefix: 'meteringPoint.actorConversation'">
      @switch (marketRole()) {
        @case (EicFunction.EnergySupplier) {
          <watt-radio-group
            [label]="t('receiverLabel')"
            [formControl]="receiverControl()"
            data-testid="actor-conversation-receiver-radio-group"
          >
            <vater-stack direction="column" align="start">
              <watt-radio [value]="ActorType.EnergySupplier">
                {{ t('receivers.ENERGY_SUPPLIER') }}
              </watt-radio>
              <watt-radio [value]="ActorType.GridAccessProvider">
                {{ t('receivers.GRID_ACCESS_PROVIDER') }}
              </watt-radio>
              <watt-radio [value]="ActorType.Energinet">
                {{ t('receivers.ENERGINET') }}
              </watt-radio>
            </vater-stack>
          </watt-radio-group>
        }
        @case (EicFunction.GridAccessProvider) {
          <watt-radio-group
            [label]="t('receiverLabel')"
            [formControl]="receiverControl()"
            data-testid="actor-conversation-receiver-radio-group"
          >
            <vater-stack direction="column" align="start">
              <watt-radio [value]="ActorType.EnergySupplier">
                {{ t('receivers.ENERGY_SUPPLIER') }}
              </watt-radio>
              <watt-radio [value]="ActorType.Energinet">
                {{ t('receivers.ENERGINET') }}
              </watt-radio>
            </vater-stack>
          </watt-radio-group>
        }
        @case (EicFunction.DataHubAdministrator) {
          <watt-radio-group
            [label]="t('receiverLabel')"
            [formControl]="receiverControl()"
            data-testid="actor-conversation-receiver-radio-group"
          >
            <vater-stack direction="column" align="start">
              <watt-radio [value]="ActorType.EnergySupplier">
                {{ t('receivers.ENERGY_SUPPLIER') }}
              </watt-radio>
              <watt-radio [value]="ActorType.GridAccessProvider">
                {{ t('receivers.GRID_ACCESS_PROVIDER') }}
              </watt-radio>
            </vater-stack>
          </watt-radio-group>
        }
      }
    </ng-container>
  `,
})
export class DhActorConversationReceiverRadioGroupComponent {
  protected readonly EicFunction = EicFunction;
  protected readonly ActorType = ActorType;

  marketRole = input.required<EicFunction | null | undefined>();
  receiverControl = input.required<FormControl<ActorType | null>>();
}
