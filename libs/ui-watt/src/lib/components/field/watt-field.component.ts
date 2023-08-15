import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'watt-field',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./watt-field.component.scss'],
  template: `
    <label>
      <span class="label">{{ label }}</span>
      <div class="watt-field">
        <ng-content select="[wattPrefix]" />
        <ng-content />
        <ng-content select="[wattSuffix]" />
      </div>
    </label>
  `,
})
export class WattFieldComponent {
  @Input() label!: string;
}
