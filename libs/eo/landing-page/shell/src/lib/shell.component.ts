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
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  CookieInformationService,
  CookieInformationCulture,
} from '@energinet-datahub/gf/util-cookie-information';

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
import { EoLandingPageNamingComponent } from './naming.component';

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
    EoLandingPageNamingComponent,
    EoLandingPageElectricalGridComponent,
    EoLandingPageBlockchainTechComponent,
    EoLandingPageGranularCertificatesComponent,
    EoLandingPageFooterComponent,
    EoLandingPageCTAComponent,
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
      <eo-landing-page-naming />
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
    }
  `,
})
export class EoLandingPageShellComponent implements OnInit {
  private transloco = inject(TranslocoService);
  private cookieInformationService: CookieInformationService = inject(CookieInformationService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.cookieInformationService.init({
      culture: this.transloco.getActiveLang() as CookieInformationCulture,
    });

    this.transloco.langChanges$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((lang) => {
      this.cookieInformationService.reInit({
        culture: lang as CookieInformationCulture,
      });
    });
  }
}
