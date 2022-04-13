import { Component, NgModule, ViewEncapsulation } from '@angular/core';
import { EoMediaModule } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';

@Component({
  selector: 'eo-origin-of-energy-global-goals-media',
  template: `<eo-media [eoMediaMaxWidthPixels]="360" class="global-goals-box">
    <p class="watt-space-inset-m">
      <strong>Global goals 7.2</strong><br />
      increase the share of renewable energy globally
    </p>
    <img
      eoMediaImage
      [eoMediaImageMaxWidthPixels]="106"
      src="/assets/images/origin-of-energy/un-global-goal-7.2.svg"
      alt="UN Global goal 7.2"
    />
  </eo-media>`,
  styles: [
    `
      :host {
        display: block;
      }

      .global-goals-box {
        border: 1px solid #f9d557; /* Color not yet added to Watt */
        max-height: 106px; /* Magic UX number that makes the box fit the text and margin */
      }
    `,
  ],
  encapsulation: ViewEncapsulation.Emulated,
})
export class EoOriginOfEnergyGlobalGoalsMediaComponent {}

@NgModule({
  declarations: [EoOriginOfEnergyGlobalGoalsMediaComponent],
  exports: [EoOriginOfEnergyGlobalGoalsMediaComponent],
  imports: [EoMediaModule],
})
export class EoOriginOfEnergyGlobalGoalsMediaScam {}
