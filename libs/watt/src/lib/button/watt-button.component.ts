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
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { WattIcon, WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

export const WattButtonTypes = ['primary', 'secondary', 'text', 'icon'] as const;
export type WattButtonVariant = (typeof WattButtonTypes)[number];
export type WattButtonType = 'button' | 'reset' | 'submit';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'watt-button',
  template: `
    <button
      mat-button
      [disabled]="disabled"
      [type]="type"
      [color]="variant"
      [attr.form]="type === 'submit' ? formId : null"
    >
      @if (loading) {
        <watt-spinner [diameter]="18" />
      }
      <div
        [ngClass]="{
          'content-wrapper--loading': loading,
          'content-wrapper': !loading,
        }"
      >
        @if (hasIcon()) {
          <watt-icon [name]="icon" />
        }
        @if (variant !== 'icon') {
          <ng-content />
        }
      </div>
    </button>
  `,
  styleUrls: ['./watt-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgClass, WattIconComponent, WattSpinnerComponent, MatButtonModule],
})
export class WattButtonComponent {
  @Input() icon?: WattIcon;
  @Input() variant: WattButtonVariant = 'primary';
  @Input() type: WattButtonType = 'button';
  @Input() formId: string | null = null;
  @Input() disabled = false;
  @Input() loading = false;

  /**
   * @ignore
   */
  @HostBinding('class.watt-button--disabled')
  get buttonDisabledState() {
    return this.disabled;
  }

  /**
   * @ignore
   */
  @HostBinding('class')
  get cssClass() {
    return `watt-button--${this.variant}`;
  }

  /**
   * @ignore
   */
  @HostBinding('style.pointer-events')
  get pointerEvents() {
    if (this.disabled) {
      // Prevents emitting a click event in Chrome/Edge/Safari when a disabled button is clicked
      // WebKit bug: https://bugs.webkit.org/show_bug.cgi?id=89041
      // Note: This solution is preferred (in this particular case) over adding styling to the Scss file
      // because the presence of inline styles can be tested with Jest.
      return 'none';
    }

    return 'auto';
  }

  /**
   * @ignore
   */
  hasIcon(): boolean {
    return !!this.icon;
  }
}
