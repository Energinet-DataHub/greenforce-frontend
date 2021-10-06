import { Component, Inject } from '@angular/core';

import { disabledAttributeToken } from '../disabled-attribute-token';

@Component({
  exportAs: 'wattSecondaryButton',
  selector: 'watt-secondary-button',
  styleUrls: ['./watt-secondary-button.component.scss'],
  templateUrl: './watt-secondary-button.component.html',
})
export class WattSecondaryButtonComponent {
  constructor(@Inject(disabledAttributeToken) public isDisabled: boolean) {}
}
