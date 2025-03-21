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
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
} from '@angular/core';

import { WattIcon, WattIconComponent } from '@energinet/watt/icon';

export type WattValidationMessageType = 'info' | 'warning' | 'success' | 'danger';
export type WattValidationMessageSize = 'compact' | 'normal';

/**
 * Usage:
 * `import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';`
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'watt-validation-message',
  styleUrl: './watt-validation-message.component.scss',
  imports: [WattIconComponent],
  host: {
    '[class]': `cssClass()`,
    '[attr.role]': 'ariaRole()',
  },
  template: `
    @if (icon()) {
      <watt-icon [name]="icon()" />
    }
    <div>
      @if (label()) {
        <strong>{{ label() }}</strong>
      }
      {{ message() }}
      <ng-content />
    </div>
  `,
})
export class WattValidationMessageComponent implements AfterViewInit {
  /**
   * @ignore
   */
  private elementRef = inject(ElementRef);

  label = input('');
  message = input('');
  icon = input<WattIcon | undefined>(undefined);
  type = input<WattValidationMessageType>('info');
  size = input<WattValidationMessageSize>('compact');
  autoScrollIntoView = input(true);

  /**
   * @ignore
   */
  cssClass = computed(
    () =>
      `watt-validation-message-type--${this.type()} watt-validation-message-size--${this.size()}`
  );

  /**
   * @ignore
   */
  ariaRole = computed(() =>
    this.type() === 'warning' || this.type() === 'danger' ? 'alert' : 'status'
  );

  /**
   * @ignore
   */
  ngAfterViewInit() {
    if (this.autoScrollIntoView()) {
      // Try to win over other auto scrolling behavior such as auto focus
      setTimeout(() => {
        this.elementRef.nativeElement.scrollIntoView();
      }, 100);
    }
  }
}
