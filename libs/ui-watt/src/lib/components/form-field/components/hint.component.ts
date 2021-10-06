import { Component, Input } from '@angular/core';

@Component({
  selector: 'watt-hint',
  template: `<ng-content></ng-content>`,
})
export class WattHintComponent {
  @Input() align: 'start' | 'end' = 'start';
}
