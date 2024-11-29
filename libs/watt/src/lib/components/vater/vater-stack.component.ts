import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';

import { Align, Direction, Spacing, Justify } from './types';
import { VaterUtilityDirective } from './vater-utility.directive';

@Component({
  selector: 'vater-stack, [vater-stack]',
  encapsulation: ViewEncapsulation.None,
  hostDirectives: [
    {
      directive: VaterUtilityDirective,
      inputs: ['fill'],
    },
  ],
  standalone: true,
  styles: [
    `
      vater-stack,
      [vater-stack] {
        display: flex;
        line-height: normal;
      }
    `,
  ],
  template: `<ng-content />`,
})
export class VaterStackComponent {
  @Input()
  @HostBinding('style.align-items')
  align: Align = 'center';

  @Input()
  @HostBinding('style.flex-direction')
  direction: Direction = 'column';

  @Input()
  gap?: Spacing;

  @Input()
  @HostBinding('style.justify-content')
  justify?: Justify;

  @Input()
  offset?: Spacing;

  @HostBinding('style.padding')
  get _offset() {
    if (!this.offset) return undefined;
    switch (this.direction) {
      case 'column':
        return `var(--watt-space-${this.offset}) 0`;
      case 'row':
        return `0 var(--watt-space-${this.offset})`;
    }
  }

  @HostBinding('style.gap')
  get _gap() {
    return this.gap ? `var(--watt-space-${this.gap})` : undefined;
  }
}
