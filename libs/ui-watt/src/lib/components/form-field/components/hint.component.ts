import { Component, Input } from '@angular/core';

@Component({
  selector: 'watt-hint',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./hint.component.scss']
})
export class WattHintComponent {
  @Input() align: 'start' | 'end' = 'start';
}
