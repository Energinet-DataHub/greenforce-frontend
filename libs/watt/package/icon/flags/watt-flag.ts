import { Component, input } from '@angular/core';
import { CountryCode } from 'libphonenumber-js';
import { WattFlagDenmarkComponent } from './watt-flag-dk';
import { WattFlagFinlandComponent } from './watt-flag-fi';
import { WattFlagGermanyComponent } from './watt-flag-de';
import { WattFlagNorwayComponent } from './watt-flag-no';
import { WattFlagPolandComponent } from './watt-flag-pl';
import { WattFlagSwedenComponent } from './watt-flag-se';
import { WattIconComponent, WattIconSize } from '../icon.component';

@Component({
  selector: 'watt-flag',
  imports: [
    WattFlagDenmarkComponent,
    WattFlagFinlandComponent,
    WattFlagGermanyComponent,
    WattFlagNorwayComponent,
    WattFlagPolandComponent,
    WattFlagSwedenComponent,
    WattIconComponent,
  ],
  template: `
    <watt-icon [size]="size()" [label]="label()">
      @switch (country()) {
        @case ('DK') {
          <watt-flag-dk />
        }
        @case ('DE') {
          <watt-flag-de />
        }
        @case ('FI') {
          <watt-flag-fi />
        }
        @case ('NO') {
          <watt-flag-no />
        }
        @case ('PL') {
          <watt-flag-pl />
        }
        @case ('SE') {
          <watt-flag-se />
        }
      }
    </watt-icon>
  `,
})
export class WattFlagComponent {
  /** Country code of the flag. */
  country = input.required<CountryCode>();

  /** Accessible label for the icon. */
  label = input<string>();

  /** Size of the icon. */
  size = input<WattIconSize>('m');
}
