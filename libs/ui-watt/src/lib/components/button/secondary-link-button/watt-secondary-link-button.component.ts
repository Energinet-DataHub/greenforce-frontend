import { Component, Inject, SkipSelf } from '@angular/core';
import { RouterLink } from '@angular/router';

import { disabledAttributeToken } from '../disabled-attribute-token';

@Component({
  exportAs: 'wattSecondaryLinkButton',
  selector: 'watt-secondary-link-button',
  styleUrls: ['./watt-secondary-link-button.component.scss'],
  templateUrl: './watt-secondary-link-button.component.html',
})
export class WattSecondaryLinkButtonComponent {
  constructor(
    @SkipSelf() public routerLink: RouterLink,
    @Inject(disabledAttributeToken) public isDisabled: boolean
  ) {}
}
