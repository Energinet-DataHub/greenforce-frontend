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
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'watt-drawer-heading',
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  styles: [
    `
      watt-drawer-heading {
        margin-left: var(--watt-space-ml);
      }

      watt-drawer-heading h1,
      watt-drawer-heading h2,
      watt-drawer-heading h3,
      watt-drawer-heading h4,
      watt-drawer-heading h5,
      watt-drawer-heading h6 {
        margin: 0;
        line-height: 48px !important; /* align with actions */
      }
    `,
  ],
  standalone: true,
})
export class WattDrawerHeadingComponent {}
