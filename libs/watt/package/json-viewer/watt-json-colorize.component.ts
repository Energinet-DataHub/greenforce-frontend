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

/**
 * Matches JSON tokens for syntax highlighting:
 * - `"(?:[^"\\]|\\.)*":?` - Strings and keys (supports escaped quotes)
 * - `-?\d+\.?\d*` - Numbers (including negative and decimals)
 * - `\b(true|false|null)\b` - Keywords
 */
const JSON_TOKEN_REGEX = /"(?:[^"\\]|\\.)*":?|-?\d+\.?\d*|\b(true|false|null)\b/g;

@Component({
  selector: 'watt-json-colorize',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: `
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
  template: `<span [innerHTML]="colorized()"></span>`,
})
export class WattJsonColorize {
  readonly json = input.required<unknown>();
  protected readonly colorized = computed(() => {
    try {
      const json = JSON.stringify(this.json(), null, ' ');
      return json === undefined
        ? `<span class='watt-json-invalid'>${this.json()?.toString() || typeof this.json()}</span>`
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
