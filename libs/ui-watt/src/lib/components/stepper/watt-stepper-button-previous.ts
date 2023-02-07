import { CdkStepperPrevious } from '@angular/cdk/stepper';
import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: 'watt-button[wattStepperPrevious]',
})
export class WattStepperButtonPreviousDirective extends CdkStepperPrevious {
  @Input() type: 'submit' | 'button' = 'submit';
  @HostBinding('class') classes = 'watt-stepper-previous';
  @HostBinding('attr.type') get typeAttr() {
    return this.type;
  }
}
