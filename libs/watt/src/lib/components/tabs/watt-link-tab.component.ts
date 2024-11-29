import { Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'watt-link-tab',
  template: ``,
})
export class WattLinkTabComponent {
  label = input.required<string>();
  link = input.required<string>();
}
