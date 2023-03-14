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
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EoPrivacyPolicyComponent } from '@energinet-datahub/eo/shared/atomic-design/feature-molecules';
import { EoScrollViewComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import {
  EoFooterComponent,
  EoHeaderComponent,
} from '@energinet-datahub/eo/shared/atomic-design/ui-organisms';
import { EoAuthService, EoTermsStore } from '@energinet-datahub/eo/shared/services';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattCheckboxModule } from '@energinet-datahub/watt/checkbox';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [EoTermsStore],
  imports: [
    FormsModule,
    WattButtonModule,
    WattCheckboxModule,
    EoFooterComponent,
    EoHeaderComponent,
    EoPrivacyPolicyComponent,
    EoScrollViewComponent,
  ],
  selector: 'eo-auth-terms',
  styles: [
    `
      eo-header,
      eo-footer {
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: auto;
      }

      .content-box {
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: auto;
      }

      .content-wrapper {
        width: 820px; // Magic number by designer.
      }
    `,
  ],
  template: `
    <eo-header></eo-header>

    <div class="content-box watt-space-inset-l">
      <div class="eo-layout-centered-content">
        <div class="content-wrapper">
          <eo-scroll-view class="watt-space-stack-l">
            <eo-privacy-policy
              class="watt-space-stack-l"
              (versionChange)="onVersionChange($event)"
            ></eo-privacy-policy>
          </eo-scroll-view>
          <div class="watt-space-stack-m">
            <watt-checkbox [(ngModel)]="hasAcceptedTerms">
              I have seen the Privacy Policy
            </watt-checkbox>
          </div>

          <watt-button class="watt-space-inline-m" variant="secondary" (click)="onCancel()">
            Back
          </watt-button>

          <watt-button variant="primary" (click)="onAccept()" [disabled]="!hasAcceptedTerms">
            Accept terms
          </watt-button>
        </div>
      </div>
    </div>

    <eo-footer></eo-footer>
  `,
})
export class EoTermsComponent {
  hasAcceptedTerms = false;

  constructor(
    private store: EoTermsStore,
    private router: Router,
    private authService: EoAuthService
  ) {}

  onVersionChange(version: string): void {
    this.store.onVersionChange(version);
  }

  onCancel(): void {
    this.authService.logout();
  }

  onAccept(): void {
    this.store.onAcceptTerms().subscribe({
      next: (response) => window.location.replace(response.next_url),
      error: () => {
        this.router.navigate(['/'], {
          state: { error: true },
          replaceUrl: true,
        });
      },
    });
  }
}
