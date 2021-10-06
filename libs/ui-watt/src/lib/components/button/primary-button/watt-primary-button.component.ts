import { Component, Inject } from '@angular/core';

import { disabledAttributeToken } from '../disabled-attribute-token';

@Component({
  exportAs: 'wattPrimaryButton',
  selector: 'watt-primary-button',
  styleUrls: ['./watt-primary-button.component.scss'],
  templateUrl: './watt-primary-button.component.html',
})
export class WattPrimaryButtonComponent {
  constructor(@Inject(disabledAttributeToken) public isDisabled: boolean) {}
}
