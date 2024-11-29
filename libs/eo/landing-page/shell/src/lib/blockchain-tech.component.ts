import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';

import { translations } from '@energinet-datahub/eo/translations';

const selector = 'eo-landing-page-blockchain-tech';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslocoPipe],
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: `
    ${selector} {
      padding: 48px 24px 0 24px;
      display: flex;
      justify-content: center;
      background: #f9f9f9;

      @media (min-width: 960px) {
        padding-top: 185px;
      }

      section {
        display: grid;
        grid-template-rows: auto 1fr;
        place-items: center;
        gap: 34px;

        @media (min-width: 960px) {
          grid-template-columns: auto 1fr;
          gap: 75px;
          max-width: 1000px;
        }
      }

      .content,
      .content > * {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 24px;
      }

      h3,
      p {
        color: rgba(0, 0, 0, 0.87);
      }

      h3 {
        margin-bottom: 6px;
      }
    }
  `,
  template: `
    <section>
      <picture>
        <source
          srcset="
            /assets/landing-page/blockchain-tech/blockchain-tech.avif    1x,
            /assets/landing-page/blockchain-tech/blockchain-tech@2x.avif 2x,
            /assets/landing-page/blockchain-tech/blockchain-tech@3x.avif 3x
          "
          type="image/avif"
        />
        <img src="/assets/landing-page/blockchain-tech/blockchain-tech.avif" />
      </picture>

      <div class="content">
        <h3 class="headline-3">
          {{ translations.landingPage.blockchainTech.heading | transloco }}
        </h3>
        <div [innerHTML]="translations.landingPage.blockchainTech.content | transloco"></div>
      </div>
    </section>
  `,
})
export class EoLandingPageBlockchainTechComponent {
  protected translations = translations;
}
