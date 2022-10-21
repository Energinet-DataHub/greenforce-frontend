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
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

import {
  WattNavListComponent,
  WattNavListItemComponent,
} from '@energinet-datahub/watt/shell';
import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-primary-navigation',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  templateUrl: './dh-primary-navigation.component.html',
  standalone: true,
  imports: [
    TranslocoModule,
    RouterModule,
    WattNavListComponent,
    WattNavListItemComponent,
    DhFeatureFlagDirectiveModule,
  ],
})
export class DhPrimaryNavigationComponent {}
