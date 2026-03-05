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
import { WattJsonColorize } from './watt-json-colorize.component';
import { isNonEmpty } from './watt-json.utils';

@Component({
  selector: 'watt-json-side',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [WattIconComponent, WattJsonColorize],
  styles: `
    watt-json-side {
      position: relative;
      padding-left: calc(var(--watt-json-level) * 20px);
      padding-right: calc(var(--watt-json-level) * 20px);
      color: var(--watt-color-primary);
    }

    watt-json-side > watt-icon {
      position: absolute;
      top: 2px;
      transform: translateX(-100%);
    }

    .watt-json-side-added:not(:empty) {
      background-color: var(--watt-color-state-success-light);
    }

    .watt-json-side-removed:not(:empty) {
      background-color: var(--watt-color-state-danger-light);
    }
  `,
  host: {
    '[class.watt-json-side-added]': '!isOriginal() && !isSame()',
    '[class.watt-json-side-removed]': 'isOriginal() && !isSame()',
  },
  template: `
    <!-- if stringified, we can check for empty value ("") instead -->
    @if (value() !== undefined) {
      @if (expandable()) {
        <watt-icon size="s" [name]="expanded() ? 'down' : 'right'" />
      }
      <span>{{ label() }}: </span>
      <watt-json-colorize [hidden]="expandable() && expanded()" [json]="value()" />
    }
  `,
})
export class WattJsonSide {
  readonly label = input<string>();
  readonly isOriginal = input.required<boolean>();
  readonly isSame = input.required<boolean>();
  readonly expanded = input.required<boolean>();
  readonly value = input<unknown>();
  protected readonly expandable = computed(() => isNonEmpty(this.value()));
}
