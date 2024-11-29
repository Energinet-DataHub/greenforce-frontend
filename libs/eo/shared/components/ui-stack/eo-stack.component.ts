import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

export type StackSize = 'XS' | 'S' | 'M' | 'L' | 'XL';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  selector: 'eo-stack',
  styles: [
    `
      :host {
        display: block;
        --_stack-size: var(--watt-space-l);
      }

      eo-stack > * + * {
        margin-block-start: var(--_stack-size);
      }

      eo-stack[size='XL'] > * {
        --_stack-size: var(--watt-space-xl);
      }

      eo-stack[size='L'] > * {
        --_stack-size: var(--watt-space-l);
      }

      eo-stack[size='M'] > * {
        --_stack-size: var(--watt-space-m);
      }

      eo-stack[size='S'] > * {
        --_stack-size: var(--watt-space-s);
      }

      eo-stack[size='XS'] > * {
        --_stack-size: var(--watt-space-xs);
      }
    `,
  ],
  template: `<ng-content />`,
})
export class EoStackComponent {
  @Input() size: StackSize = 'L';
}
