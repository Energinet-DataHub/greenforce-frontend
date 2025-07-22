//#region License
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
//#endregion
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
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ettRoutes } from '@energinet-datahub/ett/shared/utilities';
import { translations } from '@energinet-datahub/ett/translations';
import { WindTurbineComponent } from './wind-turbine.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'ett-help-page',
  imports: [RouterModule, TranslocoPipe, WindTurbineComponent],
  styles: [
    `
      ett-help-page li {
        margin-bottom: var(--watt-space-m);
      }

      .beta-block {
        margin-top: var(--watt-space-l);
        margin-left: var(--watt-space-m);
        text-align: left;
        max-width: 40rem;
        overflow-wrap: break-word;
        word-wrap: break-word;
      }

      .beta-block h2 {
        margin-top: 0;
      }

      .beta-block p {
        margin-top: var(--watt-space-m);
      }
    `,
  ],
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

    <div class="beta-block">
      <h2>{{ translations.ett_beta.title | transloco }}</h2>
      <p>{{ translations.ett_beta.content | transloco }}</p>
      <ett-wind-turbine [height]="300" [width]="200" [rotationSpeed]="5" />
    </div>
  `,
})
export class EttHelpPageComponent implements AfterViewInit {
  private cd = inject(ChangeDetectorRef);
  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  protected routes = ettRoutes;
  protected translations = translations;

  ngAfterViewInit(): void {
    this.transloco
      .selectTranslate(this.translations.help.content)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cd.detectChanges();

        const links = document.querySelectorAll('ett-help-page a[class="internal-link"]');
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
