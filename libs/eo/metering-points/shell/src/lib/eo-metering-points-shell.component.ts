import { Component, ViewEncapsulation, ChangeDetectionStrategy, NgModule } from '@angular/core';

const selector = 'eo-metering-points-shell';

@Component({
  selector,
  template: `
    <h1>
      Metering points
    </h1>
  `,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      ${selector} {
        display: block;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EoMeteringPointsShellComponent { }

@NgModule({
  declarations: [EoMeteringPointsShellComponent],
  exports: [EoMeteringPointsShellComponent]
})
export class EoMeteringPointsShellScam {}
