import { CdkStepperNext } from '@angular/cdk/stepper';
import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: 'watt-button[wattStepperNext]',
  standalone: true,
})
export class WattStepperButtonNextDirective extends CdkStepperNext {
  @Input() type: 'submit' | 'button' = 'submit';
  @HostBinding('class') classes = 'watt-stepper-next';
  @HostBinding('attr.type') get typeAttr() {
    return this.type;
  }
}
