import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { Direction, Gap } from './types';

@Component({
  selector: 'vater-scroller, [vater-scroller]',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  styles: [
    `
      vater-scroller,
      [vater-scroller] {
        display: flex;
        overflow: auto;
      }

      vater-scroller > *,
      [vater-scroller] > * {
      }
    `,
  ],
  template: `<ng-content />`,
})
export class VaterScrollerComponent {}
