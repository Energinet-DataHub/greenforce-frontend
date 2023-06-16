import { Component } from '@angular/core';
import { WattIconComponent } from '../../foundations/icon/icon.component';

@Component({
  standalone: true,
  imports: [WattIconComponent],
  selector: 'watt-search',
  styleUrls: ['./watt-search.component.scss'],
  template: `
    <label>
      <input type="text" placeholder="Søg" />
      <span class="wrapper">
        <span class="button">
          <watt-icon name="search" size="s" />
          <span class="text">Søg</span>
        </span>
      </span>
    </label>
  `,
})
export class WattSearchComponent {}
