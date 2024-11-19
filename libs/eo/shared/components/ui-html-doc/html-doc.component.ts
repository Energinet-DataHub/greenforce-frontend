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
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
  Signal,
  ViewEncapsulation,
  effect,
  DestroyRef,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { translations } from '@energinet-datahub/eo/translations';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslocoPipe, WattEmptyStateComponent],
  selector: 'eo-html-doc',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './html-doc.component.scss',
  template: `
    @if (sanitizedHtml(); as content) {
      <div class="eo-html-doc-content" [innerHtml]="content"></div>
    } @else if (loadingHtmlFailed()) {
      <watt-empty-state
        icon="danger"
        [title]="translations.terms.fetchingTermsError.title | transloco"
        [message]="translations.terms.fetchingTermsError.message | transloco"
      />
    }
  `,
})
export class EoHtmlDocComponent {
  path = input.required<string>();

  private readonly sanitizer = inject(DomSanitizer);
  private readonly http = inject(HttpClient);
  private readonly transloco = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly html = signal<string | null>(null);
  protected readonly loadingHtmlFailed = signal(false);

  protected readonly sanitizedHtml: Signal<SafeHtml | null> = computed(() =>
    this.html() ? this.sanitizer.bypassSecurityTrustHtml(this.html() as string) : null
  );

  protected readonly translations = translations;

  constructor() {
    effect(
      () => {
        const path = this.path();
        if (!path) {
          this.resetState();
          return;
        }

        const url = path.replace('${lang}', this.transloco.getActiveLang());
        this.http
          .get(url, { responseType: 'text' })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (html) => {
              this.loadingHtmlFailed.set(false);
              this.html.set(html);
            },
            error: () => {
              this.loadingHtmlFailed.set(true);
              this.html.set(null);
            },
          });
      },
      { allowSignalWrites: true }
    );
  }

  private resetState(): void {
    this.html.set(null);
    this.loadingHtmlFailed.set(false);
  }
}
