import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';

const selector = 'eo-footer';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  template: `
    <p>
      footer works!
    </p>
  `,
  styles: [`

  `]
})
export class EoFooterComponent { }

@NgModule({
  declarations: [EoFooterComponent],
  exports: [EoFooterComponent],
})
export class EoFooterComponentScam {}
