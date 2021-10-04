import { Component, Host, Input, Optional, Type } from '@angular/core';
import { RouterLink } from '@angular/router';

import { WattButtonType } from './watt-button-type';
import { WattLinkButtonComponent } from './link-button/watt-link-button.component';
import { WattPrimaryButtonComponent } from './primary-button/watt-primary-button.component';
import { WattPrimaryLinkButtonComponent } from './primary-link-button/watt-primary-link-button.component';
import { WattSecondaryButtonComponent } from './secondary-button/watt-secondary-button.component';
import { WattSecondaryLinkButtonComponent } from './secondary-link-button/watt-secondary-link-button.component';
import { WattTextButtonComponent } from './text-button/watt-text-button.component';

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

  constructor(@Optional() @Host() private routerLink?: RouterLink) {}
}
