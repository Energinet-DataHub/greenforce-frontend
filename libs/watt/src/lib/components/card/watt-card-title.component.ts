import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

const selector = 'watt-card-title';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector,
  styles: [
    `
      ${selector} {
        display: block;
      }

      ${selector} h4, ${selector} h3 {
        color: var(--watt-typography-text-color);
        margin: 0;
      }
    `,
  ],
  template: `<ng-content />`,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  host: {
    '[class]': 'cssClass()',
  },
})
export class WattCardTitleComponent {
  cssClass = () => 'watt-card__title watt-space-stack-m';
}
