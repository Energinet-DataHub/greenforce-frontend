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
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

import { translations } from '@energinet-datahub/eo/translations';
import { EoHeaderComponent } from '@energinet-datahub/eo/shared/components/ui-header';
import { EoFooterComponent } from '@energinet-datahub/eo/shared/components/ui-footer';
import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';
import { EoScrollViewComponent } from '@energinet-datahub/eo/shared/components/ui-scroll-view';

const selector = 'eo-auth-terms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormsModule,
    WattButtonComponent,
    WattCheckboxComponent,
    WattEmptyStateComponent,
    EoFooterComponent,
    EoHeaderComponent,
    TranslocoPipe,
    EoScrollViewComponent,
  ],
  selector,
  styles: [
    `
      ${selector} {
        display: grid;
        grid-template-areas:
          'header'
          'content'
          'footer';
        grid-template-rows: auto 1fr auto;
        min-height: 100vh;
        margin: 0;

        @media print {
          --eo-scroll-view-padding: 0;
          --eo-scroll-view-max-height: fit-content;
        }

        eo-header {
          grid-area: header;
        }

        > main {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          grid-area: content;
          padding: var(--watt-space-m);
          gap: var(--watt-space-m);

          @media (min-width: 768px) {
            gap: var(--watt-space-l);
            padding: var(--watt-space-l);
          }

          eo-scroll-view,
          .actions {
            max-width: 1244px;
          }
        }

        eo-footer {
          grid-area: footer;
        }

        .actions {
          width: 100%;
        }

        .terms {
          h1 {
            align-self: flex-start;
          }

          header {
            display: flex;
            align-items: flex-end;
            flex-direction: column;
            margin-bottom: var(--watt-space-l);

            .logo {
              height: 50px;
            }
          }

          header section {
            flex: 1 0 auto;
            order: -1;

            p {
              margin: 0;
              padding: 0;
            }
          }

          dl,
          .definition-list-header {
            display: grid;
            grid-template-columns: 2fr 2fr;
            gap: var(--watt-space-l) var(--watt-space-l);
            margin-top: var(--watt-space-l);
          }

          .definition-list-header,
          section ol li {
            margin-bottom: var(--watt-space-l);
          }

          dt {
            grid-column: 1;
          }

          dd {
            grid-column: 2;
            margin-left: 0;
          }

          header,
          nav,
          section {
            margin-bottom: var(--watt-space-l);
          }

          @media (min-width: 768px) {
            section p {
              padding-top: var(--watt-space-l);
              padding-left: var(--watt-space-xl);
            }

            .definition-list {
              margin-left: var(--watt-space-xl);
            }
          }

          ol {
            padding: revert;
            margin: revert;
          }
        }
      }
    `,
  ],
  template: `
    <eo-header />

    <main>
      @if (!loadingTermsFailed) {
        <eo-scroll-view class="terms">
          <div [innerHtml]="terms()"></div>
        </eo-scroll-view>

        @if (isLoggedIn) {
          <div class="actions">
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
          </div>
        }
      } @else if (loadingTermsFailed) {
        <watt-empty-state
          icon="danger"
          [title]="translations.terms.fetchingTermsError.title | transloco"
          [message]="translations.terms.fetchingTermsError.message | transloco"
        />
      }
    </main>

    <eo-footer />
  `,
})
export class EoTermsComponent {
  private transloco = inject(TranslocoService);
  private authService = inject(EoAuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private sanitizer = inject(DomSanitizer);

  language = this.transloco.getActiveLang();
  translations = translations;
  isLoggedIn = !!this.authService.user();
  loadingTermsFailed = false;

  hasAcceptedTerms = false;
  startedAcceptFlow = false;

  terms = toSignal(
    this.transloco.langChanges$.pipe(
      switchMap((lang: string) => this.loadTermsHtml(lang)),
      takeUntilDestroyed(this.destroyRef)
    )
  );

  private loadTermsHtml(lang: string): Observable<SafeHtml> {
    return this.http.get(`assets/terms/${lang}.html`, { responseType: 'text' }).pipe(
      switchMap((html: string) => {
        const safeHtml = this.sanitizer.bypassSecurityTrustHtml(html);
        this.loadingTermsFailed = false;
        return of(safeHtml);
      }),
      catchError(() => {
        this.loadingTermsFailed = true;
        return of('Error loading terms and conditions. Please try again later.');
      })
    );
  }

  onReject() {
    this.authService.logout();
  }

  onAccept() {
    if (this.startedAcceptFlow || !this.hasAcceptedTerms) return;
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
