import { Component, SkipSelf } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  exportAs: 'wattPrimaryLinkButton',
  selector: 'watt-primary-link-button',
  styleUrls: ['./watt-primary-link-button.component.scss'],
  templateUrl: './watt-primary-link-button.component.html',
})
export class WattPrimaryLinkButtonComponent {
  constructor(@SkipSelf() public routerLink: RouterLink) {}
}
