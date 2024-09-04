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
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

import { translations } from '@energinet-datahub/eo/translations';
import { EoScrollViewComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import {
  EoFooterComponent,
  EoHeaderComponent,
} from '@energinet-datahub/eo/shared/atomic-design/ui-organisms';
import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    WattButtonComponent,
    WattCheckboxComponent,
    WattEmptyStateComponent,
    EoFooterComponent,
    EoHeaderComponent,
    EoScrollViewComponent,
    WattSpinnerComponent,
    TranslocoPipe,
  ],
  selector: 'eo-auth-terms',
  styles: [
    `
      .terms::ng-deep {
        h2 {
          margin-bottom: 16px;
        }

        h3 {
          margin-top: 16px;
        }

        p {
          margin-bottom: 16px;
        }

        ol {
          margin: 8px 0;
          padding-left: 32px;

          strong {
            color: var(--watt-typography-headline-color);
          }
        }

        ul {
          margin: 8px 0;
          padding-left: 16px;
        }

        li {
          --circle-size: 8px;
        }

        table {
          font-size: 14px;
          margin: 32px 0;
          border: 1px solid black;

          th {
            background-color: var(--watt-color-primary-light);
            color: var(--watt-typography-label-color);
            text-align: left;
          }

          td {
            vertical-align: top;
            border: 1px solid rgba(0, 0, 0, 0.12); //Magic UX color for now
            padding: 4px;
          }
        }
      }

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
            @if (!terms() && !loadingTermsFailed) {
              <div style="display: flex; justify-content: center;"><watt-spinner /></div>
            } @else if (loadingTermsFailed) {
              <watt-empty-state
                icon="danger"
                [title]="translations.terms.fetchingTermsError.title | transloco"
                [message]="translations.terms.fetchingTermsError.message | transloco"
              />
            } @else {
              <div [innerHTML]="terms()" class="terms"></div>
            }
          </eo-scroll-view>

          @if (isLoggedIn) {
            <div class="watt-space-stack-m">
              <watt-checkbox [(ngModel)]="hasAcceptedTerms" [disabled]="loadingTermsFailed">
                {{ translations.terms.acceptingTerms | transloco }}
              </watt-checkbox>
            </div>

            <watt-button class="watt-space-inline-m" variant="secondary" (click)="onReject()">
              {{ translations.terms.reject | transloco }}
            </watt-button>

            <watt-button variant="primary" (click)="onAccept()" [loading]="startedAcceptFlow">
              {{ translations.terms.accept | transloco }}
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

  translations = translations;
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

  onReject() {
    this.authService.logout();
  }

  onAccept() {
    if (this.startedAcceptFlow || !this.hasAcceptedTerms) return;
    this.startedAcceptFlow = true;

    this.authService.acceptTos().then(() => {
      const redirectUrl = this.activatedRoute.snapshot.queryParamMap.get('redirectUrl');

      if (redirectUrl) {
        this.router.navigateByUrl(`${this.transloco.getActiveLang()}/${redirectUrl}`);
      } else {
        this.router.navigate([this.transloco.getActiveLang(), 'dashboard']);
      }
    });
  }
}
