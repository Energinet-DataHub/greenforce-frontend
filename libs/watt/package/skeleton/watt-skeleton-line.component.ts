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
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Usage:
 * `import { WattSkeletonLineComponent } from '@energinet/watt/skeleton';`
 */
@Component({
  selector: 'watt-skeleton-line',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./watt-skeleton-line.component.scss'],
  template: '',
  host: {
    '[style.width]': 'width()',
    '[style.height]': 'height()',
    '[style.border-radius]': 'borderRadius()',
  },
})
export class WattSkeletonLineComponent {
  /** Width of the skeleton line. Accepts any valid CSS value, e.g. '100%', '200px'. */
  width = input<string>('100%');

  /** Height of the skeleton line. Accepts any valid CSS value, e.g. '1em', '16px'. */
  height = input<string>('1em');

  /** Border radius of the skeleton line. Accepts any valid CSS value, e.g. '4px', '50%'. */
  borderRadius = input<string>('4px');
}

