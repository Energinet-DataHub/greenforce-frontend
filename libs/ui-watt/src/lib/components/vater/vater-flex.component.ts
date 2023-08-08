import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { Direction, Gap } from './types';

@Component({
  selector: 'vater-flex, [vater-flex]',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  styles: [
    `
      vater-flex,
      [vater-flex] {
        display: flex;
        height: 100%;
      }

      vater-flex > *,
      [vater-flex] > * {
        flex: 1 1 auto;
      }
    `,
  ],
  template: `<ng-content />`,
})
export class VaterFlexComponent {
  @Input()
  @HostBinding('style.flex-direction')
  direction: Direction = 'column';

  @Input() gap: Gap = 'xs'; // TODO: Default to '0' when design tokens are available
  @HostBinding('style.gap')
  get _gap() {
    return `var(--watt-space-${this.gap})`;
  }
}
