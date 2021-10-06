import { Component, Inject } from '@angular/core';

import { disabledAttributeToken } from '../disabled-attribute-token';

@Component({
  exportAs: 'wattTextButton',
  selector: 'watt-text-button',
  styleUrls: ['./watt-text-button.component.scss'],
  templateUrl: './watt-text-button.component.html',
})
export class WattTextButtonComponent {
  constructor(@Inject(disabledAttributeToken) public isDisabled: boolean) {}
}
