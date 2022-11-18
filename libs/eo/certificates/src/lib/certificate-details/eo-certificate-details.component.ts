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
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EoStackComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { eoCertificatesRoutePath } from '@energinet-datahub/eo/shared/utilities';
import { LetModule } from '@rx-angular/template';
import { map, tap } from 'rxjs';
import { EoCertificatesStore } from '../eo-certificates.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    EoStackComponent,
    CommonModule,
    RouterModule,
    LetModule,
  ],
  selector: 'eo-certificates',
  standalone: true,
  styles: [
    `
      :host {
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
    <eo-stack size="M" *rxLet="certificate$; let cert">
      <mat-card>
        <eo-stack size="M">
          <h4><b>Static Data</b></h4>
          <div class="grid-table">
            <b>Energy</b>
            <div>{{ cert?.quantity?.toLocaleString() }} Wh</div>
            <b>Start time</b>
            <div>
              {{ cert?.dateFrom | date: 'HH:mm dd-MMM-y z' | uppercase }}
            </div>
            <b>Start time</b>
            <div>
              {{ cert?.dateTo | date: 'HH:mm dd-MMM-y z' | uppercase }}
            </div>
            <b>GSRN</b>
            <div>{{ cert?.gsrn }}</div>
            <b>Certificate ID</b>
            <div>{{ cert?.id }}</div>
          </div>
        </eo-stack>
      </mat-card>
      <mat-card>
        <div class="space-between">
          <eo-stack size="M">
            <h4><b>Technology</b></h4>
            <div class="grid-table">
              <b>Technology Code</b>
              <div>{{ cert?.techCode }}</div>
              <b>Fuel Code</b>
              <div>{{ cert?.fuelCode }}</div>
            </div>
          </eo-stack>
          <img
            alt="Windmill"
            src="/assets/images/certificates/windmill.png"
            style="height: 79px;"
          />
        </div>
      </mat-card>
      <h4>
        <a class="link" routerLink="/${eoCertificatesRoutePath}">
          << Back to Certificates
        </a>
      </h4>
    </eo-stack>
    <eo-stack size="M">
      <mat-card>
        <eo-stack size="M">
          <h4><b>Bidding Zone</b></h4>
          <p><b>DK1</b></p>
          <img
            alt="Grid Area DK1"
            src="/assets/images/certificates/dk1grid.png"
            style="height: 204px; display: block"
          />
        </eo-stack>
      </mat-card>
    </eo-stack>
  `,
})
export class EoCertificateDetailsComponent {
  certificate$ = this.store.certificates$.pipe(
    map((certs) =>
      certs?.find((item) => item.id === this.route.snapshot.paramMap.get('id'))
    ),
    tap((certFound) => {
      if (!certFound) this.router.navigate([`/${eoCertificatesRoutePath}`]);
    })
  );

  constructor(
    private store: EoCertificatesStore,
    private route: ActivatedRoute,
    private router: Router
  ) {}
}
