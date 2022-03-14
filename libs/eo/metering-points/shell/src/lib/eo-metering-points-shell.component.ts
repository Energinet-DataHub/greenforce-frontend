import { Component, ViewEncapsulation, ChangeDetectionStrategy, NgModule } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';

const selector = 'eo-metering-points-shell';

@Component({
  selector,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      ${selector} {
        display: block;
      }
      .${selector}__p {
        @include watt.typography-watt-text-m; // This overrides the styles applied from Angular Material on p tags
      }
    `
  ],
  template: `
    <p class="${selector}__p">
      More functionality will be released on an ongoing basis. If you want to
      influence the new functionality, please send an email to
      <a href="mailto:xkeka@energinet.dk">xkeka@energinet.dk</a>.
    </p>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EoMeteringPointsShellComponent {
  constructor(private titleService: Title, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.data.subscribe(data => {
      this.titleService.setTitle(data.title);
    });
  }
}

@NgModule({
  declarations: [EoMeteringPointsShellComponent],
  exports: [EoMeteringPointsShellComponent]
})
export class EoMeteringPointsShellScam {}
