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
  OnDestroy,
} from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { WattEmptyStateModule } from '@energinet-datahub/watt';

import { DhMeteringPointSearchFormScam } from './form/dh-metering-point-search-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-search',
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      :host {
        display: block;
        max-width: 844px;
        margin: 0 auto;
      }

      h1 {
        color: var(--watt-color-primary-dark);
        margin-left: -2px; // todo: Why is this needed?
        margin-bottom: var(--watt-space-s);
      }

      watt-empty-state {
        margin-top: var(--watt-space-xl);
      }
    `,
  ],
  template: `
    <ng-container *transloco="let transloco; read: 'meteringPoint.search'">
      <h1>{{ transloco('title') }}</h1>

      <dh-metering-point-search-form
        (search)="onSubmit($event)"
      ></dh-metering-point-search-form>

      <watt-empty-state
        icon="explore"
        [title]="transloco('noMeteringPointFoundTitle')"
        [message]="transloco('noMeteringPointFoundMessage')"
      ></watt-empty-state>
    </ng-container>
  `,
})
export class DhMeteringPointSearchComponent {
  onSubmit(id: string) {
    console.log('Fetching...', id);
  }
}

@NgModule({
  imports: [
    DhMeteringPointSearchFormScam,
    WattEmptyStateModule,
    TranslocoModule,
  ],
  declarations: [DhMeteringPointSearchComponent],
})
export class DhMeteringPointSearchScam {}
