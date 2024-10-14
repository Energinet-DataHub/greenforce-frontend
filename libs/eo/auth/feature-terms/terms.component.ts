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
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

import { translations } from '@energinet-datahub/eo/translations';
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
    TranslocoPipe,
    NgxExtendedPdfViewerModule,
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

      .content-wrapper {
        display: flex;
        flex-direction: column;
        gap: var(--watt-space-l);
        width: 820px; // Magic number by designer.
      }

      ::ng-deep #viewer .page {
        box-shadow: none !important;
        border: none;
        margin: 0;
      }
    `,
  ],
  template: `
    <eo-header />

    <div class="eo-layout-centered-content watt-space-inset-l">
      <div class="content-wrapper watt-space-inset-l">
        @if (!loadingTermsFailed) {
          <ngx-extended-pdf-viewer
            [src]="terms()"
            [language]="language"
            [textLayer]="true"
            [height]="'60vh'"
            [showToolbar]="false"
            mobileFriendlyZoom="100%"
            zoom="page-width"
            [minZoom]="1"
            [maxZoom]="1"
            backgroundColor="var(--watt-color-neutral-grey-100)"
            (pdfLoadingFailed)="loadingTermsFailed = true"
          />

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
      </div>
    </div>

    <eo-footer />
  `,
})
export class EoTermsComponent implements OnInit {
  private transloco = inject(TranslocoService);
  private authService = inject(EoAuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  language = this.transloco.getActiveLang();
  translations = translations;
  isLoggedIn = !!this.authService.user();
  loadingTermsFailed = false;
  terms = signal<string>('');
  hasAcceptedTerms = false;
  startedAcceptFlow = false;

  ngOnInit() {
    this.transloco.langChanges$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newLang: string) => {
        this.updateTermsSource(newLang);
      });
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

  private updateTermsSource(lang: string) {
    // Assuming your PDF files are named like 'terms-en.pdf', 'terms-es.pdf', etc.
    this.terms.set(`assets/pdfs/terms-${lang}.pdf`);
  }
}
