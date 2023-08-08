import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { Direction, Gap } from './types';

@Component({
  selector: 'vater-stack, [vater-stack]',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  styles: [
    `
      vater-stack,
      [vater-stack] {
        display: flex;
        height: auto;
        align-items: center;
      }

      vater-stack > *,
      [vater-stack] > * {
        display: block;
        flex: 0 0 auto;
        line-height: normal;
      }
    `,
  ],
  template: `<ng-content />`,
})
export class VaterStackComponent {
  @Input()
  @HostBinding('style.flex-direction')
  direction: Direction = 'column';

  @Input() gap: Gap = 'xs'; // TODO: Default to '0' when design tokens are available
  @HostBinding('style.gap')
  get _gap() {
    return `var(--watt-space-${this.gap})`;
  }
}
