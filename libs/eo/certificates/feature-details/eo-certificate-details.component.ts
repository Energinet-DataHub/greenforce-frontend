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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { TranslocoPipe } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDatePipe } from '@energinet-datahub/watt/utils/date';
import { EnergyUnitPipe, eoCertificatesRoutePath } from '@energinet-datahub/eo/shared/utilities';
import { EoCertificate } from '@energinet-datahub/eo/certificates/domain';
import { EoCertificatesService } from '@energinet-datahub/eo/certificates/data-access-api';
import { EoStackComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { translations } from '@energinet-datahub/eo/translations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EnergyUnitPipe,
    EoStackComponent,
    NgIf,
    RouterModule,
    WATT_CARD,
    WattDatePipe,
    TranslocoPipe,
  ],
  standalone: true,
  styles: [
    `
      .certificate {
        display: grid;
        grid-template-columns: auto 279px;
        grid-gap: var(--watt-space-m);
        max-width: 1040px; // Magic UX number
      }

      .grid-table {
        display: grid;
        grid-template-columns: minmax(auto, 200px) auto; // Magix UX number
        gap: var(--watt-space-m);
      }

      .space-between {
        width: 100%;
        display: inline-flex;
        justify-content: space-between;
        align-items: center;
      }

      .link {
        text-decoration: none;
      }
    `,
  ],
  template: `
    @if (certificate(); as cert) {
      <div class="certificate">
        <eo-stack size="M">
          <watt-card>
            <watt-card-title
              ><h4>
                <b>{{ translations.certificateDetails.staticDataHeadline | transloco }}</b>
              </h4></watt-card-title
            >
            <eo-stack size="M">
              <div class="grid-table">
                <b>{{ translations.certificateDetails.energyLabel | transloco }}</b>
                <div>{{ cert?.quantity | energyUnit }}</div>
                <b>{{ translations.certificateDetails.startTimeLabel | transloco }}</b>
                <div>{{ cert?.start | wattDate: 'longAbbr' }}</div>
                <b>{{ translations.certificateDetails.endTimeLabel | transloco }}</b>
                <div>{{ cert?.end | wattDate: 'longAbbr' }}</div>
                <b>{{ translations.certificateDetails.gsrnLabel | transloco }}</b>
                <div>{{ cert?.attributes?.assetId }}</div>
                <b>{{ translations.certificateDetails.certificateIdLabel | transloco }}</b>
                <div>{{ cert?.federatedStreamId?.streamId }}</div>
              </div>
            </eo-stack>
          </watt-card>
          <watt-card>
            <div class="space-between">
              <eo-stack size="M">
                <h4>
                  <b>{{ translations.certificateDetails.technologyHeadline | transloco }}</b>
                </h4>
                <div class="grid-table">
                  <b>{{ translations.certificateDetails.technologyCodeLabel | transloco }}</b>
                  <div>{{ cert?.attributes?.techCode }}</div>
                  <b>{{ translations.certificateDetails.fuelCodeLabel | transloco }}</b>
                  <div>{{ cert?.attributes?.fuelCode }}</div>
                </div>
              </eo-stack>
              <img
                alt="Windmill"
                src="/assets/images/certificates/windmill.png"
                style="height: 79px;"
              />
            </div>
          </watt-card>
          <h4>
            <a class="link" routerLink="/${eoCertificatesRoutePath}">{{
              translations.certificateDetails.backToCertificatesLink | transloco
            }}</a>
          </h4>
        </eo-stack>
        <eo-stack size="M">
          <watt-card>
            <eo-stack size="M">
              <h4>
                <b>{{ translations.certificateDetails.biddingZoneHeadline | transloco }}</b>
              </h4>
              <p>
                <b>{{ cert?.gridArea }}</b>
              </p>
              <img
                alt="Grid Area DK1"
                src="/assets/images/certificates/dk1grid.png"
                style="height: 204px; display: block"
              />
            </eo-stack>
          </watt-card>
        </eo-stack>
      </div>
    }
  `,
})
export class EoCertificateDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private certificatesService: EoCertificatesService = inject(EoCertificatesService);

  protected translations = translations;

  certificate = signal<EoCertificate | null>(null);

  ngOnInit(): void {
    const registry = this.route.snapshot.paramMap.get('registry');
    const streamId = this.route.snapshot.paramMap.get('streamId');

    if (!registry || !streamId) {
      this.router.navigate([`/${eoCertificatesRoutePath}`]);
      return;
    }

    this.certificatesService.getCertificate(registry, streamId).subscribe((certificate) => {
      this.certificate.set(certificate);
    });
  }
}
