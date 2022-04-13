import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { EoPieChartScam } from './eo-origin-of-energy-pie-chart/eo-origin-of-energy-pie-chart.component';

@Component({
  selector: 'eo-origin-of-energy-pie-chart',
  template: ` <mat-card class="chart-card watt-space-inline-l">
    <div class="coming-soon-overlay"></div>
    <h3>Your share of renewable energy in 2021</h3>
    <p>Based on the hourly declaration</p>
    <eo-pie-chart class="watt-space-inset-squish-l"></eo-pie-chart>
  </mat-card>`,
  styles: [
    `
      :host {
        display: block;
      }

      .chart-card {
        width: 536px; /* Magic UX number */
      }

      .coming-soon-overlay {
        background-color: rgba(196, 196, 196, 0.7);
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: var(--watt-space-xs);

        &::before {
          content: 'Coming soon';
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          color: var(--watt-color-state-danger);
          font-weight: bold;
          font-size: 60px;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.Emulated,
})
export class EoOriginOfEnergyPieChartComponent {}

@NgModule({
  declarations: [EoOriginOfEnergyPieChartComponent],
  exports: [EoOriginOfEnergyPieChartComponent],
  imports: [MatCardModule, EoPieChartScam],
})
export class EoOriginOfEnergyPieChartScam {}
