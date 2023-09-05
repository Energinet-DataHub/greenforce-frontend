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
import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: '[watt-heading]',
  styles: [
    `
      :host-context(watt-card) {
        height: 44px;
        line-height: 44px;
        margin: 0;
      }
    `,
  ],
  template: `<ng-content />`,
})
export class WattHeadingComponent {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input({ transform: (value: string) => `watt-headline-${value}` })
  @HostBinding('class')
  size: '1' | '2' | '3' | '4' | '5' | '6' = '3';
}
