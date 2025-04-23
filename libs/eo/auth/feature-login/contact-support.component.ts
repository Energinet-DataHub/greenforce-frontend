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

import { eoRoutes } from '@energinet-datahub/eo/shared/utilities';
import { translations } from '@energinet-datahub/eo/translations';
import { WindTurbineComponent } from './wind-turbine.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'eo-contact-support',
  imports: [RouterModule, TranslocoPipe, WindTurbineComponent],
  styles: [
    `
      .support-block {
        margin-top: var(--watt-space-l);
        margin-left: var(--watt-space-m);
        text-align: left;
        max-width: 40rem;
        overflow-wrap: break-word;
        word-wrap: break-word;
      }

      .support-block h2 {
        margin-top: 0;
      }

      .support-block p {
        margin-top: var(--watt-space-m);
      }

      .contact-info p {
        margin-bottom: var(--watt-space-s);
      }
    `,
  ],
  template: `
    <div class="support-block">
      <h2 [innerHTML]="translations.shared.notWhitelistedError.title | transloco"></h2>
      <p [innerHTML]="translations.shared.notWhitelistedError.message | transloco"></p>
      <eo-wind-turbine [height]="300" [width]="200" [rotationSpeed]="5" />
    </div>
  `,
})
export class ContactSupportComponent implements AfterViewInit {
  private cd = inject(ChangeDetectorRef);
  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  protected routes = eoRoutes;
  protected translations = translations;

  ngAfterViewInit(): void {
    this.transloco
      .selectTranslate(this.translations.shared.notWhitelistedError.title)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cd.detectChanges();
      });

    const links = document.querySelectorAll('eo-contact-support a[class="internal-link"]');
    links.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.router.navigate([link.getAttribute('href')]);
      });
    });
  }
}
