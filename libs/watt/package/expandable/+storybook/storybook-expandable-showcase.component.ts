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

import { WattExpandableComponent } from '../watt-expandable.component';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ' +
  'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ' +
  'exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat';

@Component({
  selector: 'watt-storybook-expandable-showcase',
  imports: [WattExpandableComponent],
  styles: `
    :host {
      display: block;
      padding: var(--watt-space-l);
      background: var(--watt-color-neutral-white);
    }

    .title {
      margin: 0;
    }

    .divider {
      border: 0;
      border-top: 1px solid var(--watt-color-neutral-grey-200);
      margin: var(--watt-space-m) 0 var(--watt-space-l);
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--watt-space-l);
    }
  `,
  template: `
    <h1 class="title watt-headline-2">Accordion link</h1>
    <hr class="divider" />
    <div class="grid">
      <watt-expandable labelCollapsed="Vis indhold" labelExpanded="Skjul indhold">
        <p>{{ lorem }}</p>
      </watt-expandable>
      <watt-expandable
        [expanded]="true"
        labelCollapsed="Vis indhold"
        labelExpanded="Skjul indhold"
      >
        <p>{{ lorem }}</p>
      </watt-expandable>
    </div>
  `,
})
export class WattStorybookExpandableShowcaseComponent {
  protected readonly lorem = LOREM;
}
