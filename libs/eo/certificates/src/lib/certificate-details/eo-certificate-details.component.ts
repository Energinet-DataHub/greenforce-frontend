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
import { MatCardModule } from '@angular/material/card';
import { EoStackComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { eoCertificatesRoutePath } from '@energinet-datahub/eo/shared/utilities';
import { EoCertificatesStore } from '../eo-certificates.store';
import { map, tap } from 'rxjs';
import { LetModule } from '@rx-angular/template';

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
    //language=scss
    `
      :host {
        display: grid;
        grid-template-columns: 1fr 279px;
        grid-gap: var(--watt-space-m);
        max-width: 1040px; // Magic UX number
      }

      table {
        th {
          text-align: left;
          width: 200px; // Magic UX number
          height: 34px; // Magic UX number
        }
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
          <table>
            <tr>
              <th>Energy</th>
              <td>{{ cert?.quantity?.toLocaleString() }} Wh</td>
            </tr>
            <tr>
              <th>Start time</th>
              <td>
                {{ cert?.dateFrom | date: 'HH:mm dd-MMM-y z' | uppercase }}
              </td>
            </tr>
            <tr>
              <th>Start time</th>
              <td>
                {{ cert?.dateTo | date: 'HH:mm dd-MMM-y z' | uppercase }}
              </td>
            </tr>
            <tr>
              <th>GSRN</th>
              <td>{{ cert?.gsrn }}</td>
            </tr>
            <tr>
              <th>Certificate ID</th>
              <td>{{ cert?.id }}</td>
            </tr>
          </table>
        </eo-stack>
      </mat-card>
      <mat-card>
        <div class="space-between">
          <eo-stack size="M">
            <h4><b>Technology</b></h4>
            <table>
              <tr>
                <th>Technology Code</th>
                <td>{{ cert?.techCode }}</td>
              </tr>
              <tr>
                <th>Fuel Code</th>
                <td>{{ cert?.fuelCode }}</td>
              </tr>
            </table>
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
