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
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattEmptyStateNotFoundComponent } from '@energinet-datahub/watt/empty-state';
import { VaterFlexComponent } from '@energinet-datahub/watt/vater';

@Component({
  selector: 'dh-404',
  imports: [
    RouterLink,
    TranslocoDirective,

    VaterFlexComponent,
    WattEmptyStateNotFoundComponent,
    WattButtonComponent,
  ],
  styles: `
    watt-empty-state-not-found {
      color: var(--watt-color-primary);
      width: 75%;
    }
  `,
  template: `
    <vater-flex align="center" *transloco="let t; prefix: 'notFound'">
      <watt-empty-state-not-found />
      <h2>{{ t('title') }}</h2>
      <p class="watt-space-stack-l">{{ t('message') }}</p>
      <watt-button class="watt-space-stack-m" routerLink="/" variant="secondary">{{
        t('action')
      }}</watt-button>
    </vater-flex>
  `,
})
export class Dh404Component {}
