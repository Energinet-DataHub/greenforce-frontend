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
import { AsyncPipe, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

import { EoPrivacyPolicyComponent } from '@energinet-datahub/eo/shared/atomic-design/feature-molecules';
import { EoScrollViewComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import {
  EoFooterComponent,
  EoHeaderComponent,
} from '@energinet-datahub/eo/shared/atomic-design/ui-organisms';
import { EoAuthService, EoTermsService } from '@energinet-datahub/eo/shared/services';

interface VersionResponse {
  version: number;
}
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    WattButtonComponent,
    WattCheckboxComponent,
    EoFooterComponent,
    EoHeaderComponent,
    EoPrivacyPolicyComponent,
    EoScrollViewComponent,
    WattSpinnerComponent,
    NgIf,
    AsyncPipe,
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
    <eo-header />

    <div class="content-box watt-space-inset-l">
      <div class="eo-layout-centered-content">
        <div class="content-wrapper">
          <eo-scroll-view class="watt-space-stack-l">
            <eo-privacy-policy
              class="watt-space-stack-l"
              [policy]="privacyPolicy$ | async"
              [hasError]="loadingPrivacyPolicyFailed"
            />
          </eo-scroll-view>
          <div class="watt-space-stack-m">
            <watt-checkbox
              [(ngModel)]="hasAcceptedPrivacyPolicy"
              [disabled]="loadingPrivacyPolicyFailed"
            >
              I have seen the Privacy Policy
            </watt-checkbox>
          </div>

          <watt-button class="watt-space-inline-m" variant="secondary" (click)="onCancel()">
            Back
          </watt-button>

          <watt-button
            variant="primary"
            (click)="onAccept()"
            [disabled]="!hasAcceptedPrivacyPolicy"
            [loading]="startedAcceptFlow"
          >
            Accept terms
          </watt-button>
        </div>
      </div>
    </div>

    <eo-footer />
  `,
})
export class EoTermsComponent {
  private http = inject(HttpClient);
  private termsService = inject(EoTermsService);
  private authService = inject(EoAuthService);
  private router = inject(Router);
  private policyVersion$ = this.http.get<VersionResponse>(
    '/assets/configuration/privacy-policy.json'
  );

  loadingPrivacyPolicyFailed = false;
  privacyPolicy$ = this.policyVersion$.pipe(
    switchMap((response) => {
      this.termsService.setVersion(response.version);
      return this.http.get('/assets/html/privacy-policy.html', { responseType: 'text' });
    }),
    catchError(() => {
      this.termsService.setVersion(-1);
      this.loadingPrivacyPolicyFailed = true;

      return of(null);
    })
  );

  hasAcceptedPrivacyPolicy = false;
  startedAcceptFlow = false;

  onCancel() {
    this.authService.logout();
  }

  onAccept() {
    if (this.startedAcceptFlow) return;
    this.startedAcceptFlow = true;

    this.termsService.acceptTerms().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/']),
    });
  }
}
