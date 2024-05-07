/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ChangeDetectionStrategy, Component, afterNextRender, afterRender, inject } from '@angular/core';


import { EoLandingPageHeaderComponent } from './header.component';
import { EoLandingPageHeroComponent } from './hero.component';
import { EoLandingPageWhyComponent } from './why.component';
import { EoLandingPageHowComponent } from './how.component';
import { EoLandingPageWhatComponent } from './what.component';
import { EoLandingPageProveSustainabilityComponent } from './prove-sustainability.component';
import { EoLandingPageElectricalGridComponent } from './electrical-grid.component';
import { EoLandingPageBlockchainTechComponent } from './blockchain-tech.component';
import { EoLandingPageGranularCertificatesComponent } from './granular-certificates.component';
import { EoLandingPageFooterComponent } from './footer.component';
import { EoLandingPageCTAComponent } from './cta.component';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    EoLandingPageHeaderComponent,
    EoLandingPageHeroComponent,
    TranslocoPipe,
    EoLandingPageWhyComponent,
    //EoLandingPageHowComponent,
    //EoLandingPageWhatComponent,
    //EoLandingPageProveSustainabilityComponent,
    //EoLandingPageElectricalGridComponent,
    //EoLandingPageBlockchainTechComponent,
    //EoLandingPageGranularCertificatesComponent,
    //EoLandingPageFooterComponent,
    //EoLandingPageCTAComponent,
  ],
  selector: 'eo-landing-page-shell',
  template: `
    <eo-landing-page-header />
    <eo-landing-page-hero />

    @defer (on viewport; prefetch on idle) {
      <eo-landing-page-why />
    } @placeholder {
      <p>Loading...</p>
    }
<!--
    @defer (on viewport; prefetch on idle) {
      <eo-landing-page-how />
    } @placeholder {
      <p>Loading...</p>
    }

    @defer (on viewport; prefetch on idle) {
      <eo-landing-page-what />
    } @placeholder {
      <p>Loading...</p>
    }

    @defer (on viewport; prefetch on idle) {
      <eo-landing-page-electrical-grid />
    } @placeholder {
      <p>Loading...</p>
    }

    @defer (on viewport; prefetch on idle) {
      <eo-landing-page-blockchain-tech />
    } @placeholder {
      <p>Loading...</p>
    }

    @defer (on viewport; prefetch on idle) {
      <eo-landing-page-granular-certificates />
    } @placeholder {
      <p>Loading...</p>
    }

    @defer (on viewport; prefetch on idle) {
      <eo-landing-page-prove-sustainability />
    } @placeholder {
      <p>Loading...</p>
    }

    @defer (on viewport; prefetch on idle) {
      <eo-landing-page-cta />
    } @placeholder {
      <p>Loading...</p>
    }

    @defer (on viewport; prefetch on idle) {
      <eo-landing-page-footer />
    } @placeholder {
      <p>Loading...</p>
    }-->
  `,
})
export class EoLandingPageShellComponent {
  private transloco = inject(TranslocoService);

  constructor() {
    console.log('HEST');
    afterNextRender(() => {
      console.log('ACTIVE LANG', this.transloco.getActiveLang());
      this.transloco.selectTranslate('landing-page').subscribe((res) => {
        console.log('WHAAT', res);
      });
    });

    afterRender(() => {
      console.log('WHAAT')
    });


  }
}
