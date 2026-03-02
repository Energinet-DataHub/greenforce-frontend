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
import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

export type WattSeparatorSize = 'regular' | 'bold';
export type WattSeparatorOrientation = 'horizontal' | 'vertical';

/**
 * Usage:
 * `import { WattSeparatorComponent } from '@energinet/watt/separator';`
 */
@Component({
  selector: 'watt-separator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.aria-orientation]': 'orientation()',
    '[attr.role]': '"separator"',
    '[class]': '"watt-separator--" + orientation() + " watt-separator--" + size()',
  },
  template: '',
  styles: `
    watt-separator {
      display: block;
      border-color: var(--watt-color-neutral-grey-300);
      border-style: solid;
      border-width: 0;
    }

    watt-separator.watt-separator--horizontal {
      width: 100%;
      border-top-width: 1px;
    }

    watt-separator.watt-separator--horizontal.watt-separator--bold {
      border-top-width: 2px;
    }

    watt-separator.watt-separator--vertical {
      align-self: stretch;
      height: auto;
      border-left-width: 1px;
    }

    watt-separator.watt-separator--vertical.watt-separator--bold {
      border-left-width: 2px;
    }
  `,
})
export class WattSeparatorComponent {
  size = input<WattSeparatorSize>('regular');
  orientation = input<WattSeparatorOrientation>('horizontal');
}
