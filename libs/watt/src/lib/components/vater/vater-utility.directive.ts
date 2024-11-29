import { Directive, HostBinding, Input } from '@angular/core';

export type Fill = 'horizontal' | 'vertical' | 'both';
export type Inset = '0' | 'xs' | 's' | 'm' | 'ml' | 'l' | 'xl';

/* eslint-disable @angular-eslint/no-input-rename */
@Directive({
  selector: '[vater]',
  standalone: true,
})
export class VaterUtilityDirective {
  /** Stretch the element to fill the available space in one or both directions. */
  @Input({ transform: (value: Fill) => `vater-fill-${value}` })
  fill?: Fill;

  /** Position the element absolute with the provided inset value. */
  @Input({ transform: (value: Inset) => `vater-inset-${value}` })
  inset?: Inset;

  @Input()
  center?: string;

  @HostBinding('class')
  get _class() {
    return [this.fill, this.inset].filter(Boolean);
  }

  @HostBinding('class.vater-center')
  get _center() {
    return this.center === '';
  }
}
