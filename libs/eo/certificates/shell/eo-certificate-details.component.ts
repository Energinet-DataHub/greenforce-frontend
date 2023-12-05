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
import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RxLet } from '@rx-angular/template/let';
import { map, tap } from 'rxjs';

import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WATT_CARD } from '@energinet-datahub/watt/card';

import { EoStackComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { eoCertificatesRoutePath } from '@energinet-datahub/eo/shared/utilities';
import { EoCertificatesStore } from '@energinet-datahub/eo/certificates/data-access-api';
import { EoBetaMessageComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EoStackComponent,
    RouterModule,
    RxLet,
    UpperCasePipe,
    WattDatePipe,
    EoBetaMessageComponent,
    WATT_CARD,
  ],
  selector: 'eo-certificates',
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
    <eo-eo-beta-message />
    <div class="certificate">
      <eo-stack size="M" *rxLet="certificate$; let cert">
        <watt-card>
          <watt-card-title
            ><h4><b>Static Data</b></h4></watt-card-title
          >
          <eo-stack size="M">
            <div class="grid-table">
              <b>Energy</b>
              <div>{{ cert?.quantity?.toLocaleString() }} Wh</div>
              <b>Start time</b>
              <div>{{ cert?.start | wattDate: 'longAbbr' }}</div>
              <b>Start time</b>
              <div>{{ cert?.end | wattDate: 'longAbbr' }}</div>
              <b>GSRN</b>
              <div>{{ cert?.attributes?.assetId }}</div>
              <b>Certificate ID</b>
              <div>{{ cert?.federatedStreamId?.streamId }}</div>
            </div>
          </eo-stack>
        </watt-card>
        <watt-card>
          <div class="space-between">
            <eo-stack size="M">
              <h4><b>Technology</b></h4>
              <div class="grid-table">
                <b>Technology Code</b>
                <div>{{ cert?.attributes?.techCode }}</div>
                <b>Fuel Code</b>
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
          <a class="link" routerLink="/${eoCertificatesRoutePath}"> << Back to Certificates </a>
        </h4>
      </eo-stack>
      <eo-stack size="M">
        <watt-card>
          <eo-stack size="M">
            <h4><b>Bidding Zone</b></h4>
            <p><b>DK1</b></p>
            <img
              alt="Grid Area DK1"
              src="/assets/images/certificates/dk1grid.png"
              style="height: 204px; display: block"
            />
          </eo-stack>
        </watt-card>
      </eo-stack>
    </div>
  `,
})
export class EoCertificateDetailsComponent {
  private store: EoCertificatesStore = inject(EoCertificatesStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  certificate$ = this.store.certificates$.pipe(
    map((certs) => certs?.find((item) => item.federatedStreamId.streamId === this.route.snapshot.paramMap.get('id'))),
    tap((certFound) => {
      if (!certFound) this.router.navigate([`/${eoCertificatesRoutePath}`]);
    })
  );
}
