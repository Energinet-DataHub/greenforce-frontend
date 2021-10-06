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
import {
  Component,
  Host,
  Injector,
  Input,
  Optional,
  Type,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { WattButtonType } from './watt-button-type';
import { WattLinkButtonComponent } from './link-button/watt-link-button.component';
import { WattPrimaryButtonComponent } from './primary-button/watt-primary-button.component';
import { WattPrimaryLinkButtonComponent } from './primary-link-button/watt-primary-link-button.component';
import { WattSecondaryButtonComponent } from './secondary-button/watt-secondary-button.component';
import { WattSecondaryLinkButtonComponent } from './secondary-link-button/watt-secondary-link-button.component';
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
      case 'text':
        return this.hasLink ? WattLinkButtonComponent : WattTextButtonComponent;
      case 'primary':
        return this.hasLink
          ? WattPrimaryLinkButtonComponent
          : WattPrimaryButtonComponent;
      case 'secondary':
        return this.hasLink
          ? WattSecondaryLinkButtonComponent
          : WattSecondaryButtonComponent;
      default:
        return WattTextButtonComponent;
    }
  }
  get hasIcon(): boolean {
    return this.icon !== '' && this.icon != null;
  }
  get hasLink(): boolean {
    return this.routerLink != null;
  }
  get iconColor(): '' | 'primary' {
    return this.isPrimaryButton ? '' : 'primary';
  }

  constructor(
    private injector: Injector,
    @Optional() @Host() private routerLink?: RouterLink
  ) {}
}
