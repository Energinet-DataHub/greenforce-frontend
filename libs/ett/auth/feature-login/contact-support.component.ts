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
  inject,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ettRoutes } from '@energinet-datahub/ett/shared/utilities';
import { translations } from '@energinet-datahub/ett/translations';
import { WindTurbineComponent } from './wind-turbine.component';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { EttAuthService } from '@energinet-datahub/ett/auth/data-access';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ett-contact-support',
  imports: [RouterModule, TranslocoPipe, WindTurbineComponent, WattButtonComponent],
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
      }

      .support-block {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .support-block > * {
        margin-top: 10px;
        margin-bottom: 10px;
      }
    `,
  ],
  template: `
    <div class="support-block">
      <h2 [innerHTML]="translations.shared.notWhitelistedError.title | transloco"></h2>
      <p [innerHTML]="translations.shared.notWhitelistedError.message | transloco"></p>
      <ett-wind-turbine [height]="300" [width]="200" [rotationSpeed]="5" />
      <watt-button (click)="authService.logout()"
        >{{ translations.shared.notWhitelistedError.logout | transloco }}
      </watt-button>
    </div>
  `,
})
export class ContactSupportComponent implements AfterViewInit {
  protected routes = ettRoutes;
  protected translations = translations;
  protected authService = inject(EttAuthService);
  private cd = inject(ChangeDetectorRef);
  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  ngAfterViewInit(): void {
    this.transloco
      .selectTranslate(this.translations.shared.notWhitelistedError.title)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cd.detectChanges();
      });

    const links = document.querySelectorAll('ett-contact-support a[class="internal-link"]');
    links.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.router.navigate([link.getAttribute('href')]);
      });
    });
  }
}
