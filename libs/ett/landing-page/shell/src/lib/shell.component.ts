//#region License
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
//#endregion
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  CookieInformationService,
  CookieInformationCulture,
} from '@energinet-datahub/gf/util-cookie-information';

import { EttLandingPageHeaderComponent } from './header.component';
import { EttLandingPageHeroComponent } from './hero.component';
import { EttLandingPageWhyComponent } from './why.component';
import { EttLandingPageHowComponent } from './how.component';
import { EttLandingPageWhatComponent } from './what.component';
import { EttLandingPageProveSustainabilityComponent } from './prove-sustainability.component';
import { EttLandingPageElectricalGridComponent } from './electrical-grid.component';
import { EttLandingPageBlockchainTechComponent } from './blockchain-tech.component';
import { EttLandingPageGranularCertificatesComponent } from './granular-certificates.component';
import { EttFooterComponent } from '@energinet-datahub/ett/shared/components/ui-footer';
import { EttLandingPageCTAComponent } from './cta.component';
import { EttLandingPageNamingComponent } from './naming.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EttLandingPageHeaderComponent,
    EttLandingPageHeroComponent,
    EttLandingPageWhyComponent,
    EttLandingPageHowComponent,
    EttLandingPageWhatComponent,
    EttLandingPageProveSustainabilityComponent,
    EttLandingPageNamingComponent,
    EttLandingPageElectricalGridComponent,
    EttLandingPageBlockchainTechComponent,
    EttLandingPageGranularCertificatesComponent,
    EttFooterComponent,
    EttLandingPageCTAComponent,
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
      <ett-landing-page-naming />
    } @placeholder {
      <p>Loading...</p>
    }

    @defer (on viewport; prefetch on idle) {
      <ett-landing-page-cta />
    } @placeholder {
      <p>Loading...</p>
    }

    @defer (on viewport; prefetch on idle) {
      <ett-footer />
    } @placeholder {
      <p>Loading...</p>
    }
  `,
})
export class EttLandingPageShellComponent implements OnInit {
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
