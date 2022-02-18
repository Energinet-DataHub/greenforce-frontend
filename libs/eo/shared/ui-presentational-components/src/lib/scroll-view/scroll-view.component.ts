import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';

const selector = 'eo-scroll-view';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  template: `
    <article>
      <ng-content></ng-content>
    </article>
  `,
  styles: [
    `
    ${selector} {
      display: block;
      width: calc(200 * var(--watt-space-xs));
      padding: calc(4 * var(--watt-space-xs));
      margin-bottom: var(--watt-space-l);
      background: var(--watt-color-neutral-white);
      border-radius: var(--watt-space-xs);
      word-break: break-word;

      // This is the contents of the privacy policy with the custom scrollbar
      article {
        max-height: calc(100 * var(--watt-space-xs));
        word-break: break-word;
        overflow-y: scroll;
        padding-right: calc(4 * var(--watt-space-xs));
        &::-webkit-scrollbar {
          width: 6px;
        }
        &::-webkit-scrollbar-track {
          background: var(--watt-color-neutral-white);
          border-radius: 50px;
        }
        &::-webkit-scrollbar-thumb {
          background-color: var(--watt-color-primary);
          border-radius: 50px;
        }
      }
    }
    `
  ]
})
export class EoScrollViewComponent  {}

@NgModule({
  declarations: [EoScrollViewComponent],
  exports: [EoScrollViewComponent]
})
export class EoScrollViewScam {}
