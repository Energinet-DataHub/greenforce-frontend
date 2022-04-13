import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'eo-origin-of-energy-chart-tips',
  template: `
    <mat-card class="tip-card">
      <div class="tip-card-header">
        <img
          class="lightbulb-icon"
          src="/assets/icons/lightbulb.svg"
          alt="Global goal 7.2"
        />
        <h1>Tip</h1>
      </div>
      <p>
        You can increase your share of renewable energy by shifting your
        consumption to periods with more renewable energy in the grid.
      </p>
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .lightbulb-icon {
        width: 70px; /* Magic UX image size*/
      }

      .tip-card {
        background-color: var(--watt-color-primary-light);
        border-radius: var(--watt-space-m);
      }

      .tip-card-header {
        display: flex;
        align-items: center;
        margin-bottom: var(--watt-space-m);
        gap: calc(var(--watt-space-l) - var(--watt-space-s));
      }
    `,
  ],
  encapsulation: ViewEncapsulation.Emulated,
})
export class EoOriginOfEnergyChartTipsComponent {}

@NgModule({
  declarations: [EoOriginOfEnergyChartTipsComponent],
  exports: [EoOriginOfEnergyChartTipsComponent],
  imports: [MatCardModule],
})
export class EoOriginOfEnergyChartTipsScam {}
