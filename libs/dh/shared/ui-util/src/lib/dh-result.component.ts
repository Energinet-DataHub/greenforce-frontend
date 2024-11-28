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
import { Component, input } from '@angular/core';

import { TranslocoPipe } from '@ngneat/transloco';

import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

@Component({
  standalone: true,
  selector: 'dh-result',
  imports: [TranslocoPipe, WattSpinnerComponent, WattEmptyStateComponent, VaterStackComponent],
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    h4 {
      display: block;
      text-align: center;
    }
  `,
  template: `
    @if (!loading() && !hasError() && !empty()) {
      <ng-content />
    } @else {
      <vater-stack direction="row" offset="m" fill="vertical" justify="center" align="center">
        @if (loading()) {
          <watt-spinner />
        }

        @if (hasError()) {
          <watt-empty-state
            icon="custom-power"
            [title]="'shared.error.title' | transloco"
            [message]="'shared.error.message' | transloco"
          />
        }
        @if (empty()) {
          <h4>{{ 'shared.empty.title' | transloco }}</h4>
        }
      </vater-stack>
    }
  `,
})
export class DhResultComponent {
  loading = input<boolean>(false);
  hasError = input<boolean>(false);
  empty = input<boolean>(false);
}
