import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { eoRoutes } from '@energinet-datahub/eo/shared/utilities';
import { translations } from '@energinet-datahub/eo/translations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, TranslocoPipe],
  standalone: true,
  selector: 'eo-help-page',
  styles: [
    `
      eo-help-page li {
        margin-bottom: var(--watt-space-m);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      [innerHTML]="
        translations.help.content
          | transloco
            : {
                faqLink: routes.help + '/' + routes.faq,
                introductionLink: routes.help + '/' + routes.introduction,
              }
      "
    ></div>
  `,
})
export class EoHelpPageComponent implements AfterViewInit {
  private cd = inject(ChangeDetectorRef);
  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  protected routes = eoRoutes;
  protected translations = translations;

  ngAfterViewInit(): void {
    this.transloco
      .selectTranslate(this.translations.help.content)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cd.detectChanges();

        const links = document.querySelectorAll('eo-help-page a[class="internal-link"]');

        links.forEach((link) => {
          link.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.router.navigate([link.getAttribute('href')]);
          });
        });
      });
  }
}
