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
import { ChangeDetectionStrategy, Component } from '@angular/core';

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

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    EoLandingPageHeaderComponent,
    EoLandingPageHeroComponent,
    EoLandingPageWhyComponent,
    EoLandingPageHowComponent,
    EoLandingPageWhatComponent,
    EoLandingPageProveSustainabilityComponent,
    EoLandingPageElectricalGridComponent,
    EoLandingPageBlockchainTechComponent,
    EoLandingPageGranularCertificatesComponent,
    EoLandingPageFooterComponent,
    EoLandingPageCTAComponent,
  ],
  selector: 'ett-landing-page-shell',
  template: `
    <ett-landing-page-header />
    <ett-landing-page-hero />

    @defer (on viewport; prefetch on idle) {
      <ett-landing-page-why />
    } @placeholder {
      <p>Loading...</p>
    }

    @defer (on viewport; prefetch on idle) {
      <ett-landing-page-how />
    } @placeholder {
      <p>Loading...</p>
    }

    @defer (on viewport; prefetch on idle) {
      <ett-landing-page-what />
    } @placeholder {
      <p>Loading...</p>
    }

    @defer (on viewport; prefetch on idle) {
      <ett-landing-page-electrical-grid />
    } @placeholder {
      <p>Loading...</p>
    }

    @defer (on viewport; prefetch on idle) {
      <ett-landing-page-blockchain-tech />
    } @placeholder {
      <p>Loading...</p>
    }

    @defer (on viewport; prefetch on idle) {
      <ett-landing-page-granular-certificates />
    } @placeholder {
      <p>Loading...</p>
    }

    @defer (on viewport; prefetch on idle) {
      <ett-landing-page-prove-sustainability />
    } @placeholder {
      <p>Loading...</p>
    }

    @defer (on viewport; prefetch on idle) {
      <ett-landing-page-cta />
    } @placeholder {
      <p>Loading...</p>
    }

    @defer (on viewport; prefetch on idle) {
      <ett-landing-page-footer />
    } @placeholder {
      <p>Loading...</p>
    }
  `,
})
export class EoLandingPageShellComponent {}
