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
    <p>
      scroll-view works!
    </p>
  `,
  styles: [
    `
    ${selector} {
      display: block;
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
