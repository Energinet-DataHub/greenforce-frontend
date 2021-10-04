import { Component, SkipSelf } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  exportAs: 'wattLinkButton',
  selector: 'watt-link-button',
  styleUrls: ['./watt-link-button.component.scss'],
  templateUrl: './watt-link-button.component.html',
})
export class WattLinkButtonComponent {
  constructor(@SkipSelf() public routerLink: RouterLink) {}
}
