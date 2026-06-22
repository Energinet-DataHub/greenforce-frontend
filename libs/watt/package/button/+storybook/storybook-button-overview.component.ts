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
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { VATER } from '../../vater';

import { WattButtonComponent } from '../watt-button.component';

@Component({
  selector: 'storybook-button-overview',
  styles: [
    `
      .button-state-grid {
        grid-template-columns: 8rem 7rem repeat(4, max-content);
        row-gap: 0.75rem;
        column-gap: 1.5rem;
        align-items: center;
        justify-items: start;
      }

      .button-state-grid .col-header-start {
        grid-column: 3;
      }

      .button-state-grid .col-label {
        grid-column: 2;
        margin: 0;
      }

      .button-state-grid .group-label {
        grid-column: 1 / -1;
        padding-top: var(--watt-space-m);
        font-weight: 600;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './storybook-button-overview.component.html',
  imports: [WattButtonComponent, VATER],
})
export class StorybookButtonOverviewComponent {}
