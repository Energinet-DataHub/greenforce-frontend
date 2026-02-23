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
import { Component, computed, input } from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';

import { VaterStackComponent } from '@energinet/watt/vater';
import { WattSpinnerComponent } from '@energinet/watt/spinner';
import { WattEmptyStateComponent } from '@energinet/watt/empty-state';

import { QueryResult } from '@energinet-datahub/dh/shared/util-apollo';

type Variant = 'normal' | 'compact';

@Component({
  selector: 'dh-result',
  imports: [TranslocoPipe, WattSpinnerComponent, WattEmptyStateComponent, VaterStackComponent],
  styles: `
    :host {
      display: block;
    }

    h4 {
      display: block;
      text-align: center;
    }
  `,
  template: `
    @if (!showSpinner() && !showError() && !empty()) {
      <ng-content />
    } @else {
      <vater-stack
        fill="vertical"
        [justify]="variant() === 'compact' ? 'start' : 'center'"
        [align]="variant() === 'compact' ? 'start' : 'center'"
      >
        @if (variant() === 'compact') {
          <vater-stack class="watt-text-s" direction="row" fill="horizontal" gap="m" align="start">
            @if (showSpinner()) {
              <div>{{ loadingText() }}</div>
              <watt-spinner [diameter]="loadingSpinnerDiameter()" />
            }

            @if (empty() && !showSpinner() && !showError()) {
              <div>{{ emptyText() }}</div>
            }

            @if (showError() && !showSpinner()) {
              <div>{{ 'shared.error.message' | transloco }}</div>
            }
          </vater-stack>
        }

        @if (showSpinner() && variant() === 'normal') {
          <watt-spinner />
        }

        @if (showError() && !showSpinner() && variant() === 'normal') {
          <watt-empty-state
            icon="custom-power"
            [title]="'shared.error.title' | transloco"
            [message]="'shared.error.message' | transloco"
          />
        }
        @if (empty() && !showSpinner() && !showError() && variant() === 'normal') {
          <ng-content select="h4[dh-result-empty-title]">
            <h4>{{ 'shared.empty.title' | transloco }}</h4>
          </ng-content>
        }
      </vater-stack>
    }
  `,
})
export class DhResultComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query = input<QueryResult<any, any>>();
  loading = input<boolean>();
  hasError = input<boolean>();
  empty = input<boolean>(false);
  emptyText = input<string>();
  loadingText = input<string>();
  variant = input<Variant>('normal');

  showSpinner = computed(() => this.loading() ?? this.query()?.loading() ?? false);
  showError = computed(() => this.hasError() ?? this.query()?.hasError() ?? false);

  loadingSpinnerDiameter = computed(() => {
    if (this.variant() == 'compact') return 24;

    return 44;
  });
}
