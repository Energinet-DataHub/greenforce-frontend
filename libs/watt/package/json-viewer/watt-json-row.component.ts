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
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { WattIconComponent } from '@energinet/watt/icon';
import { isNonEmpty } from './watt-json.utils';

const JSON_TOKEN_REGEX = /"(?:[^"\\]|\\.)*":?|-?\d+\.?\d*|\b(true|false|null)\b/g;

@Component({
  selector: 'watt-json-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [WattIconComponent],
  styles: `
    watt-json-row {
      position: relative;
      padding-left: calc(var(--watt-json-level) * 20px);
      padding-right: calc(var(--watt-json-level) * 20px);
      color: var(--watt-color-primary);
    }

    watt-json-row > watt-icon {
      position: absolute;
      top: 2px;
      transform: translateX(-100%);
    }

    .watt-json-row-added:not(:empty) {
      background-color: var(--watt-color-state-success-light);
    }

    .watt-json-row-removed:not(:empty) {
      background-color: var(--watt-color-state-danger-light);
    }

    .watt-json-invalid {
      color: var(--watt-on-light-low-emphasis);
    }

    .watt-json-key {
      color: var(--watt-color-primary);
    }

    .watt-json-string {
      color: var(--watt-color-state-success);
    }

    .watt-json-number {
      color: var(--watt-color-state-warning);
    }

    .watt-json-keyword {
      color: var(--watt-color-state-danger);
    }
  `,
  host: {
    '[class.watt-json-row-added]': '!isOriginal() && !isSame()',
    '[class.watt-json-row-removed]': 'isOriginal() && !isSame()',
  },
  template: `
    @if (value() !== undefined) {
      @if (expandable()) {
        <watt-icon size="s" [name]="expanded() ? 'down' : 'right'" />
      }
      <span>{{ label() }}: </span>
      <span [hidden]="expandable() && expanded()" [innerHTML]="colorized()"></span>
    }
  `,
})
export class WattJsonRow {
  readonly label = input<string>();
  readonly isOriginal = input.required<boolean>();
  readonly isSame = input.required<boolean>();
  readonly expanded = input.required<boolean>();
  readonly value = input<unknown>();

  protected readonly expandable = computed(() => isNonEmpty(this.value()));
  protected readonly colorized = computed(() => {
    try {
      const json = JSON.stringify(this.value(), null, ' ');
      return json === undefined
        ? `<span class='watt-json-invalid'>${this.value()?.toString() || typeof this.value()}</span>`
        : json.replace(JSON_TOKEN_REGEX, (match) => {
            switch (true) {
              case match.endsWith(':'):
                return `<span class='watt-json-key'>${match.slice(1, -2)}</span>:`;
              case match.startsWith('"'):
                return `<span class='watt-json-string'>${match}</span>`;
              case /\d/.test(match):
                return `<span class='watt-json-number'>${match}</span>`;
              default:
                return `<span class='watt-json-keyword'>${match}</span>`;
            }
          });
    } catch {
      return `<span class='watt-json-invalid'>[Circular]</span>`;
    }
  });
}
