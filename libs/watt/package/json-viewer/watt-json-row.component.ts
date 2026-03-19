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
import { isNonEmpty, tokenize } from './watt-json.utils';

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

    .watt-json-function,
    .watt-json-undefined {
      color: var(--watt-on-light-low-emphasis);
    }

    .watt-json-punctuation {
      color: var(--watt-on-light-medium-emphasis);
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

    .watt-json-boolean,
    .watt-json-null {
      color: var(--watt-color-state-danger);
    }
  `,
  host: {
    '[class.watt-json-row-added]': '!isBaseline() && !isSame()',
    '[class.watt-json-row-removed]': 'isBaseline() && !isSame()',
  },
  template: `
    @if (value() !== undefined) {
      @if (expandable()) {
        <watt-icon size="s" [name]="expanded() ? 'down' : 'right'" />
      }
      <span>{{ label() }}: </span>
      <span [hidden]="expanded()">
        @for (token of tokens(); track $index) {
          <span [class]="'watt-json-' + token.kind">{{ token.value }}</span>
        }
      </span>
    }
  `,
})
export class WattJsonRow {
  readonly label = input<string>();
  readonly isBaseline = input.required<boolean>();
  readonly isSame = input.required<boolean>();
  readonly expanded = input.required<boolean>();
  readonly value = input<unknown>();
  readonly diff = input(false);

  protected readonly expandable = computed(() => isNonEmpty(this.value()));
  protected readonly budget = computed(() => (this.diff() ? 40 : 80));
  protected readonly tokens = computed(() => [
    ...tokenize(this.value(), this.expandable() ? this.budget() : Infinity),
  ]);
}
