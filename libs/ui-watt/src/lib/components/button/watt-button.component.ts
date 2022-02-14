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
  Injector,
  Input,
  Type,
  ViewEncapsulation,
} from '@angular/core';

import { disabledAttributeToken } from './disabled-attribute-token';
import { typeAttributeToken } from './type-attribute-token';
import { WattButtonSize } from './watt-button-size';
import { WattButtonType } from './watt-button-type';
import { WattButtonVariant } from './watt-button-variant';
import { WattIcon } from './../../foundations/icon';
import { WattPrimaryButtonComponent } from './primary-button/watt-primary-button.component';
import { WattSecondaryButtonComponent } from './secondary-button/watt-secondary-button.component';
import { WattTextButtonComponent } from './text-button/watt-text-button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-button',
  styleUrls: ['./watt-button.component.scss'],
  templateUrl: './watt-button.component.html',
})
export class WattButtonComponent {
  /**
   * @ignore
   */
  private _variant: WattButtonVariant = 'text';

  @HostBinding('class')
  get buttonSize() {
    return `watt-button-size-${this.size}`;
  }

  @HostBinding('class.watt-button-loading')
  get buttonLoadingState() {
    return this.loading;
  }

  @HostBinding('class.watt-button-disabled')
  get buttonDisabledState() {
    return this.disabled;
  }

  @Input() icon?: WattIcon;
  @Input() type: WattButtonType = 'button';

  @Input()
  get variant(): WattButtonVariant {
    return this._variant;
  }
  set variant(value: WattButtonVariant) {
    if (value == null || (value as unknown) === '') {
      value = 'text';
    }

    this._variant = value;
  }

  @Input() size: WattButtonSize = 'normal';

  @Input() disabled = false;

  @Input() loading = false;

  get buttonComponentInjector(): Injector {
    return Injector.create({
      providers: [
        {
          provide: disabledAttributeToken,
          useValue: this.disabled,
        },
        {
          provide: typeAttributeToken,
          useValue: this.type,
        },
      ],
      parent: this.injector,
    });
  }

  get buttonComponentVariant(): Type<unknown> {
    switch (this.variant) {
      case 'primary':
        return WattPrimaryButtonComponent;
      case 'secondary':
        return WattSecondaryButtonComponent;
      case 'text':
      default:
        return WattTextButtonComponent;
    }
  }

  get hasIcon(): boolean {
    return !!this.icon;
  }

  constructor(private injector: Injector) {}
}
