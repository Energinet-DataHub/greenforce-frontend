import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { EoScrollViewComponent } from '@energinet-datahub/eo/shared/components/ui-scroll-view';
import { EoHtmlDocComponent } from '@energinet-datahub/eo/shared/components/ui-html-doc';

const selector = 'eo-service-provider-terms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [EoScrollViewComponent, EoHtmlDocComponent],
  selector,
  styles: [
    `
      ${selector} {
        --eo-scroll-view-max-height: fit-content;
        display: flex;
        justify-content: center;

        @media print {
          --eo-scroll-view-padding: 0;
        }

        .service-provider-terms {
          max-width: 1500px;
        }
      }
    `,
  ],
  template: `
    <eo-scroll-view class="service-provider-terms">
      <eo-html-doc [path]="path" />
    </eo-scroll-view>
  `,
})
export class EoServiceProviderTermsComponent {
  path = 'assets/service-provider-terms/${lang}.html';
}
