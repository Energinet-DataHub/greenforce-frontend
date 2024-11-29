import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@ngneat/transloco';

import { SharedUtilities } from '@energinet-datahub/eo/shared/utilities';
import { translations } from '@energinet-datahub/eo/translations';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslocoPipe, TranslocoDirective],
  selector: 'eo-faq-page',
  styles: [
    `
      eo-faq-page {
        display: block;
        max-width: 1040px; // Magic number by designer

        .faq-link a {
          color: var(--watt-color-primary);
          text-decoration: none;
        }

        h3 {
          margin-top: var(--watt-space-xl);
          margin-bottom: var(--watt-space-s);
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  template: ` <div [innerHTML]="content()"></div> `,
})
export class EoFaqPageComponent implements AfterViewInit {
  private utils = inject(SharedUtilities);
  private transloco = inject(TranslocoService);
  private cd = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);
  private destroyRef = inject(DestroyRef);

  protected content = signal<SafeHtml>('');

  ngAfterViewInit(): void {
    this.transloco
      .selectTranslate(translations.faq.content)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this.content.set(this.sanitizer.bypassSecurityTrustHtml(result));

        this.cd.detectChanges();

        const scrollToElements = document.querySelectorAll('eo-faq-page a[href^="#"]');
        scrollToElements.forEach((element) => {
          element.addEventListener('click', (event) => {
            event.preventDefault();
            const target = element.getAttribute('href')?.replace('#', '');
            this.utils.scrollToAnchor(target as string);
          });
        });
      });
  }
}
