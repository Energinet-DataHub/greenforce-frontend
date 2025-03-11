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
import { Component, input } from '@angular/core';

import { WattIconComponent } from '../../icon/icon.component';
import { WattTooltipDirective } from '../../tooltip';
import { WattCopyToClipboardDirective } from '../watt-copy-to-clipboard.directive';

@Component({
  imports: [WattTooltipDirective, WattIconComponent, WattCopyToClipboardDirective],
  selector: 'watt-storybook-copy-to-clipboard',
  styles: [
    `
      :host {
        color: var(--watt-color-primary-dark);
      }

      :host span {
        text-decoration: underline;
      }

      :host watt-icon {
        display: inline-flex;
        margin-left: var(--watt-space-xs);
      }
    `,
  ],
  template: `
    <span
      class="watt-storybook-copy-to-clipboard"
      [wattCopyToClipboard]="text()"
      [wattTooltip]="tooltip()"
    >
      <ng-content />
      <watt-icon size="xs" name="contentCopy" />
    </span>
  `,
})
export class WattStorybookCopyToClipboardComponent {
  text = input<string>();
  tooltip = input('');
}

@Component({
  imports: [WattStorybookCopyToClipboardComponent],
  selector: 'watt-storybook-clipboard',
  template: `
    <p>
      Rich in heavy atoms emerged into consciousness globular star cluster Vangelis not a sunrise
      but a galaxyrise hydrogen atoms? A mote of dust suspended in a sunbeam vastness is bearable
      only through love shores of the cosmic ocean how far away dream of the mind's eye something
      incredible is waiting to be known? Citizens of distant epochs citizens of distant
      <watt-storybook-copy-to-clipboard text="epochs" tooltip="Copy word to clipboard"
        >epochs</watt-storybook-copy-to-clipboard
      >
      a very small stage in a vast cosmic arena the ash of stellar alchemy observer the ash of
      stellar alchemy and billions upon
      <watt-storybook-copy-to-clipboard text="1000000000" tooltip="Copy as number"
        >billions</watt-storybook-copy-to-clipboard
      >
      upon billions.
    </p>
  `,
})
export class WattStorybookClipboardComponent {}
