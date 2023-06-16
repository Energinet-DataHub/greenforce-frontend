import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WattIconComponent } from '../../foundations/icon/icon.component';

@Component({
  standalone: true,
  imports: [WattIconComponent],
  selector: 'watt-search',
  styleUrls: ['./watt-search.component.scss'],
  template: `
    <label>
      <input #input type="text" [placeholder]="label" (input)="search.emit(input.value)" />
      <span class="wrapper">
        <span class="button">
          <watt-icon name="search" size="s" />
          <span class="text">{{ label }}</span>
        </span>
      </span>
    </label>
  `,
})
export class WattSearchComponent {
  @Input() label?: string;
  @Output() search = new EventEmitter<string>();
}
