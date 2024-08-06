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
import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';

import { EoPrivacyPolicyComponent } from '@energinet-datahub/eo/shared/atomic-design/feature-molecules';
import { EoScrollViewComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import {
  EoFooterComponent,
  EoHeaderComponent,
} from '@energinet-datahub/eo/shared/atomic-design/ui-organisms';
import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';
import { TranslocoService } from '@ngneat/transloco';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';

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
            <!-- TODO: INLINE THIS COMPONENT -->
            <eo-privacy-policy
              class="watt-space-stack-l"
              [policy]="terms()"
              [hasError]="loadingTermsFailed"
            />
          </eo-scroll-view>

          @if (isLoggedIn) {
            <div class="watt-space-stack-m">
              <watt-checkbox [(ngModel)]="hasAcceptedTerms" [disabled]="loadingTermsFailed">
                I have seen the Privacy Policy
              </watt-checkbox>
            </div>

            <watt-button class="watt-space-inline-m" variant="secondary" (click)="onCancel()">
              Back
            </watt-button>

            <watt-button
              variant="primary"
              (click)="onAccept()"
              [disabled]="!hasAcceptedTerms"
              [loading]="startedAcceptFlow"
            >
              Accept terms
            </watt-button>
          }
        </div>
      </div>
    </div>

    <eo-footer />
  `,
})
export class EoTermsComponent {
  private http = inject(HttpClient);
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private transloco = inject(TranslocoService);
  private authService = inject(EoAuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  isLoggedIn = !!this.authService.user();
  loadingTermsFailed = false;
  terms = toSignal(
    this.http.get('/assets/html/privacy-policy.html', { responseType: 'text' }).pipe(
      map((html) => this.sanitizer.bypassSecurityTrustHtml(html)),
      catchError(() => {
        this.loadingTermsFailed = true;
        return of(null);
      })
    )
  );
  hasAcceptedTerms = false;
  startedAcceptFlow = false;

  onCancel() {
    this.authService.logout();
  }

  onAccept() {
    if (this.startedAcceptFlow) return;
    this.startedAcceptFlow = true;

    this.authService.acceptTos().then(() => {
      const redirectUrl = this.activatedRoute.snapshot.queryParamMap.get('redirectUrl');

      if (redirectUrl) {
        this.router.navigateByUrl(redirectUrl);
      } else {
        this.router.navigate([this.transloco.getActiveLang(), 'dashboard']);
      }
    });
  }
}
