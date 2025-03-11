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
import { MatIcon } from '@angular/material/icon';
import { WattIconMap } from './icons';

export type WattIcon = keyof typeof WattIconMap;
export type WattIconSize = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
export type WattIconState = 'default' | 'success' | 'danger' | 'warning' | 'info';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classNames()' },
  imports: [MatIcon],
  selector: 'watt-icon',
  styleUrls: ['./icon.component.scss'],
  template: `
    @if (icon()) {
      <mat-icon aria-hidden="false" [attr.aria-label]="label()" fontSet="material-symbols-sharp">
        {{ icon() }}
      </mat-icon>
    } @else {
      <div class="watt-custom-icon">
        <ng-content />
      </div>
    }
  `,
})
export class WattIconComponent {
  /** Name of an icon within the font set. */
  name = input<WattIcon>();

  /** Accessible label for the icon. */
  label = input<string>();

  /** Size of the icon. */
  size = input<WattIconSize>('m');

  /** Color the icon to match a chosen state. */
  state = input<WattIconState>();

  icon = computed(() => {
    const name = this.name();
    if (!name) return null;
    return WattIconMap[name];
  });

  computedState = computed(() => {
    const name = this.name();
    const state = this.state();
    if (state) return state;
    switch (name) {
      case 'success':
      case 'danger':
      case 'warning':
      case 'info':
        return name;
      default:
        return 'default';
    }
  });

  classNames = computed(() => `icon-size-${this.size()} icon-state-${this.computedState()}`);
}
