/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnInit,
} from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import {
  WattButtonModule,
  WattEmptyStateModule,
  WattFormFieldModule,
  WattInputModule,
} from '@energinet-datahub/watt';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-search',
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      :host {
        display: flex;
        justify-content: center;
      }

      .container {
        display: flex;
        flex-wrap: wrap;
        max-width: 844px;
        justify-content: space-between;
      }

      h1,
      label,
      watt-form-field,
      watt-empty-state {
        width: 100%;
        flex: 1 1 auto;
      }

      h1 {
        margin-bottom: var(--watt-space-s);
      }

      label {
        @include watt.typography-watt-text-m;
        margin-bottom: var(--watt-space-s);
      }

      watt-form-field {
        width: auto;
        margin-right: var(--watt-space-s);
      }

      watt-button {
        margin-top: var(--watt-space-xs);
      }

      watt-empty-state {
        margin-top: var(--watt-space-xl);
      }
    `,
  ],
  template: `
    <div class="container" *transloco="let transloco">
      <h1>{{ transloco('meteringPoint.search.title') }}</h1>
      <label for="search-input">
        {{ transloco('meteringPoint.search.searchLabel') }}
      </label>
      <watt-form-field>
        <watt-icon-button icon="search" wattPrefix></watt-icon-button>
        <input
          wattInput
          id="search-input"
          type="text"
          aria-label="search-input"
          [placeholder]="transloco('meteringPoint.search.searchPlaceholder')"
        />
        <watt-error>
          {{ transloco('meteringPoint.search.searchInvalidLength') }}
        </watt-error>
        <watt-icon-button icon="close" wattSuffix></watt-icon-button>
      </watt-form-field>
      <watt-button
        type="primary"
        size="normal"
        [disabled]="false"
        [loading]="false"
        >{{ transloco('meteringPoint.search.searchButton') }}</watt-button
      >
      <watt-empty-state
        icon="explore"
        [title]="transloco('meteringPoint.search.noMeteringPointFoundTitle')"
        [message]="
          transloco('meteringPoint.search.noMeteringPointFoundMessage')
        "
      ></watt-empty-state>
    </div>
  `,
})
export class DhMeteringPointSearchComponent implements OnInit {
  ngOnInit(): void {
    document.getElementById('test')?.focus();
  }
}

@NgModule({
  imports: [
    WattFormFieldModule,
    WattInputModule,
    WattButtonModule,
    WattEmptyStateModule,
    TranslocoModule,
  ],
  declarations: [DhMeteringPointSearchComponent],
})
export class DhMeteringPointSearchScam {}
