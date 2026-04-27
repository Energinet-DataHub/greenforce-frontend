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
import { WattSpinnerComponent } from '@energinet/watt/spinner';
import { WattIcon, WattIconComponent } from '@energinet/watt/icon';

export const WattButtonTypes = ['primary', 'secondary', 'text', 'icon', 'selection'] as const;
export type WattButtonVariant = (typeof WattButtonTypes)[number];
export type WattButtonType = 'button' | 'reset' | 'submit';
export type WattButtonSize = 'small' | 'medium';
export type WattButtonIconPosition = 'leading' | 'trailing';

@Component({
  selector: 'watt-button',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./watt-button.component.scss'],
  host: {
    '[class]': 'classes()',
    '[class.watt-button--disabled]': 'disabled()',
    '[style.pointer-events]': 'pointerEvents()',
  },
  imports: [WattIconComponent, WattSpinnerComponent, MatButtonModule],
  template: `
    <button
      mat-button
      [disableRipple]="true"
      [disabled]="disabled()"
      [type]="type()"
      [color]="variant()"
      [attr.form]="type() === 'submit' ? formId() : null"
      [attr.aria-label]="ariaLabel()"
    >
      @if (loading()) {
        <watt-spinner [diameter]="18" />
      }
      <div [class.content-wrapper]="!loading()" [class.content-wrapper--loading]="loading()">
        @if (hasIcon()) {
          <watt-icon [name]="icon()" [class.watt-icon-trailing]="hasTrailingIcon()" />
        }
        @if (variant() !== 'icon') {
          <span class="text-content"><ng-content /></span>
        }
      </div>
    </button>
  `,
})
export class WattButtonComponent {
  icon = input<WattIcon>();
  iconPosition = input<WattButtonIconPosition>('leading');
  variant = input<WattButtonVariant>('primary');
  size = input<WattButtonSize>('medium');
  type = input<WattButtonType>('button');
  formId = input<string | null>(null);
  disabled = input(false);
  loading = input(false);
  /**
   * Forwards an accessible label to the inner native `<button>`. Required when the button has
   * no visible text content (e.g. icon-only variants), so screen readers and role-based
   * locators can identify it.
   */
  ariaLabel = input<string | null>(null, { alias: 'aria-label' });

  classes = computed(() => `watt-button--${this.variant()} watt-button-size--${this.size()}`);

  // Prevents emitting a click event in Chrome/Edge/Safari when a disabled button is clicked
  // WebKit bug: https://bugs.webkit.org/show_bug.cgi?id=89041
  // Note: This solution is preferred (in this particular case) over adding styling to the Scss file
  // because the presence of inline styles can be tested with Vitest.
  pointerEvents = computed(() => (this.disabled() ? 'none' : 'auto'));

  /**
   * @ignore
   */
  hasIcon = computed(() => !!this.icon());
  hasTrailingIcon = computed(() => this.hasIcon() && this.iconPosition() === 'trailing');
}
