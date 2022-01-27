import { Component, Input } from '@angular/core';

@Component({
  selector: 'watt-checkbox',
  templateUrl: './watt-checkbox.component.html',
})
export class WattCheckboxComponent {
  @Input() disabled = false;
}
