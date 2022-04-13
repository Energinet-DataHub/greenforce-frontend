import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'eo-origin-of-energy-hourly-declaration',
  template: `<mat-card class="description-card">
    <p><strong>Hourly Declaration</strong></p>
    <p>
      The hourly declaration describes the origin of the energy you have
      consumed within a given period as well as the corresponding emissions.
    </p>
    <p>
      The declaration is calculated as a weighted average based on your hourly
      electricity consumption and the corresponding hourly residual mix in your
      bidding zone.
    </p>
  </mat-card>`,
  styles: [
    `
      :host {
        display: block;
      }

      .description-card {
        gap: var(--watt-space-m);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.Emulated,
})
export class EoOriginOfEnergyHourlyDeclarationComponent {}

@NgModule({
  declarations: [EoOriginOfEnergyHourlyDeclarationComponent],
  exports: [EoOriginOfEnergyHourlyDeclarationComponent],
  imports: [MatCardModule],
})
export class EoOriginOfEnergyHourlyDeclarationScam {}
