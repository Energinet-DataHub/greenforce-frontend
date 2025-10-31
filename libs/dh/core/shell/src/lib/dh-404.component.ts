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
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet/watt/button';
import { WattEmptyStateNotFoundComponent } from '@energinet/watt/empty-state';
import { VaterStackComponent } from '@energinet/watt/vater';
import { DhApplicationInsights } from '@energinet-datahub/dh/shared/util-application-insights';

@Component({
  selector: 'dh-404',
  imports: [
    RouterLink,
    TranslocoDirective,

    WattEmptyStateNotFoundComponent,
    WattButtonComponent,
    VaterStackComponent,
  ],
  styles: `
    @use '@energinet/watt/utils' as watt;

    watt-empty-state-not-found {
      color: var(--watt-color-primary);
      width: 80%;

      @include watt.media('>Medium') {
        width: 700px;
      }
    }
  `,
  template: `
    <vater-stack justify="center" fill="vertical" *transloco="let t; prefix: 'notFound'">
      <watt-empty-state-not-found />
      <h2>{{ t('title') }}</h2>
      <p class="watt-space-stack-l">{{ t('message') }}</p>
      <watt-button class="watt-space-stack-m" routerLink="/" variant="secondary">{{
        t('action')
      }}</watt-button>
    </vater-stack>
  `,
})
export class Dh404Component {
  constructor() {
    inject(DhApplicationInsights).trackPageView('404 - Page Not Found');
  }
}
