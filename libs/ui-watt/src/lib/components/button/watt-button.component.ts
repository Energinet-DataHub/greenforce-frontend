/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { Component, Injector, Input, Type } from '@angular/core';

import { WattButtonType } from './watt-button-type';
import { WattPrimaryButtonComponent } from './primary-button/watt-primary-button.component';
import { WattSecondaryButtonComponent } from './secondary-button/watt-secondary-button.component';
import { WattTextButtonComponent } from './text-button/watt-text-button.component';
import { disabledAttributeToken } from './disabled-attribute-token';

@Component({
  selector: 'watt-button',
  styleUrls: ['./watt-button.component.scss'],
  templateUrl: './watt-button.component.html',
})
export class WattButtonComponent {
  /**
   * @ignore
   */
  private _type: WattButtonType = 'text';
  private get isPrimaryButton(): boolean {
    return this.type === 'primary';
  }

  @Input()
  icon = '';
  @Input()
  get type(): WattButtonType {
    return this._type;
  }
  set type(value: WattButtonType) {
    if (value == null || (value as unknown) === '') {
      value = 'text';
    }

    this._type = value;
  }
  @Input()
  disabled = false;

  get buttonComponentInjector(): Injector {
    return Injector.create({
      providers: [
        {
          provide: disabledAttributeToken,
          useValue: this.disabled,
        },
      ],
      parent: this.injector,
    });
  }

  get buttonComponentType(): Type<unknown> {
    switch (this.type) {
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
    return this.icon !== '' && this.icon != null;
  }

  constructor(private injector: Injector) {}
}
