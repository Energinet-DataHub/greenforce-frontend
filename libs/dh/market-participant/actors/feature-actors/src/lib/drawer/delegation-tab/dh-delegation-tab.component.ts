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
import { Component } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

@Component({
  selector: 'dh-delegation-tab',
  standalone: true,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  template: `
    <ng-container
      *transloco="let t; read: 'marketParticipant.actorsOverview.drawer.tabs.delegation'"
    >
      <vater-stack direction="row" justify="center">
        <watt-empty-state
          icon="custom-no-results"
          [title]="t('emptyTitle')"
          [message]="t('emptyMessage')"
        />
      </vater-stack>
    </ng-container>
  `,
  imports: [TranslocoDirective, VaterStackComponent, WattEmptyStateComponent],
})
export class DhDelegationTabComponent {}
