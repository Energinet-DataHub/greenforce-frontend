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
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { NgStyle } from '@angular/common';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCheckboxComponent } from '@energinet-datahub/watt/checkbox';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { translations } from '@energinet-datahub/eo/translations';
import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';
import { EoScrollViewComponent } from '@energinet-datahub/eo/shared/components/ui-scroll-view';
import { EoHtmlDocComponent } from '@energinet-datahub/eo/shared/components/ui-html-doc';

const selector = 'eo-auth-terms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormsModule,
    WattButtonComponent,
    WattCheckboxComponent,
    TranslocoPipe,
    NgStyle,
    EoScrollViewComponent,
    EoHtmlDocComponent,
  ],
  selector,
  styles: [
    `
      ${selector} {
        display: flex;
        justify-content: center;

        @media print {
          --eo-scroll-view-padding: 0;
        }

        .terms, .actions {
          max-width: 1500px;
        }

        .actions {
          margin-top: var(--watt-space-l);
          width: 100%;
        }
      }
    `,
  ],
  template: `
    <eo-scroll-view
      class="terms"
      [ngStyle]="{
        '--eo-scroll-view-max-height': showActions ? 'calc(100vh - 300px)' : 'fit-content',
      }"
    >
      <eo-html-doc [path]="path" />
    </eo-scroll-view>

    @if (showActions) {
      <div class="actions">
        <div class="watt-space-stack-m">
          <watt-checkbox [(ngModel)]="hasAcceptedTerms">
            {{ translations.terms.acceptingTerms | transloco }}
          </watt-checkbox>
        </div>

        <watt-button class="watt-space-inline-m" variant="secondary" (click)="onReject()">
          {{ translations.terms.reject | transloco }}
        </watt-button>

        <watt-button variant="primary" (click)="onAccept()" [loading]="startedAcceptFlow()">
          {{ translations.terms.accept | transloco }}
        </watt-button>
      </div>
    }
  `,
})
export class EoTermsComponent {
  private transloco = inject(TranslocoService);
  private authService = inject(EoAuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastService: WattToastService = inject(WattToastService);

  protected showActions = history.state?.['show-actions'];
  protected language = this.transloco.getActiveLang();
  protected translations = translations;
  protected isLoggedIn = !!this.authService.user();

  protected hasAcceptedTerms = false;
  protected startedAcceptFlow = signal<boolean>(false);

  protected path = 'assets/terms/${lang}.html';

  onReject() {
    this.authService.logout();
  }

  onAccept() {
    if (this.startedAcceptFlow() || !this.hasAcceptedTerms) return;
    this.startedAcceptFlow.set(true);

    this.authService
      .acceptTos()
      .then(() => {
        const redirectUrl = this.activatedRoute.snapshot.queryParamMap.get('redirectUrl');

        if (redirectUrl) {
          this.router.navigateByUrl(redirectUrl);
        } else {
          this.router.navigate([this.transloco.getActiveLang(), 'dashboard']);
        }
      })
      .catch(() => {
        this.startedAcceptFlow.set(false);
        this.toastService.open({
          message: this.transloco.translate(this.translations.shared.error.message),
          type: 'danger',
        });
      });
  }
}
