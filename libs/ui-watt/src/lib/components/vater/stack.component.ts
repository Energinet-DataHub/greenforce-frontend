import { Component, HostBinding, Input } from '@angular/core';

export type VaterStackDirection = 'row' | 'column';

// TODO: Get these values from design tokens
export type VaterStackGap = 'xs' | 's' | 'm' | 'ml' | 'l' | 'xl';

@Component({
  selector: 'vater-stack',
  standalone: true,
  styles: [
    `
      :host {
        display: flex;
      }
    `,
  ],
  template: `<ng-content />`,
})
export class VaterStackComponent {
  @Input()
  @HostBinding('style.flex-direction')
  direction: VaterStackDirection = 'row';

  @Input() gap: VaterStackGap = 'xs'; // TODO: Default to '0' when design tokens are available
  @HostBinding('style.gap')
  get _gap() {
    return `var(--watt-space-${this.gap})`;
  }
}
