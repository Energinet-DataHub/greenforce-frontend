import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';

const selector = 'eo-header';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector,
  template: `
    <p>
      header works!
    </p>
  `,
  styles: [`

  `]
})
export class EoHeaderComponent { }

@NgModule({
  declarations: [EoHeaderComponent],
  exports: [EoHeaderComponent],
})
export class EoHeaderComponentScam {}
