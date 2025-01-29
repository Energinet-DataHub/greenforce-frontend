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
  input,
  computed,
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { WattSpinnerComponent } from '../spinner';
import { WattIcon } from '../../foundations/icon';
import { WattIconComponent } from './../../foundations/icon/icon.component';

export const WattButtonTypes = ['primary', 'secondary', 'text', 'icon'] as const;
export type WattButtonVariant = (typeof WattButtonTypes)[number];
export type WattButtonType = 'button' | 'reset' | 'submit';

@Component({
  selector: 'watt-button',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./watt-button.component.scss'],
  host: {
    '[class.watt-button--disabled]': 'disabled()',
    '[class]': 'buttonVariant()',
    '[style.pointer-events]': 'pointerEvents()', // Prevents emitting a click event in Chrome/Edge/Safari when a disabled button is clicked
  },
  imports: [WattIconComponent, WattSpinnerComponent, MatButtonModule],
  template: `
    <button
      mat-button
      [disabled]="disabled()"
      [type]="type()"
      [color]="variant()"
      [attr.form]="type() === 'submit' ? formId() : null"
    >
      @if (loading()) {
        <watt-spinner [diameter]="18" />
      }
      <div [class.content-wrapper]="!loading()" [class.content-wrapper--loading]="loading()">
        @if (hasIcon()) {
          <watt-icon [name]="icon()" />
        }
        @if (variant() !== 'icon') {
          <ng-content />
        }
      </div>
    </button>
  `,
})
export class WattButtonComponent {
  icon = input<WattIcon>();
  variant = input<WattButtonVariant>('primary');
  type = input<WattButtonType>('button');
  formId = input<string | null>(null);
  disabled = input(false);
  loading = input(false);

  buttonVariant = computed(() => `watt-button--${this.variant()}`);
  pointerEvents = computed(() => (this.disabled() ? 'none' : 'auto'));

  /**
   * @ignore
   */
  hasIcon(): boolean {
    return !!this.icon();
  }
}
