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
import { Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';

import { eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattNavListComponent, WattNavListItemComponent, WattShellComponent } from '@energinet-datahub/watt/shell';
import { translations } from '@energinet-datahub/eo/translations';

const selector = 'eo-api-documentation';

@Component({
  standalone: true,
  selector,
  imports: [WattShellComponent, WattNavListComponent, WattNavListItemComponent, WattIconComponent, RouterOutlet, TranslocoPipe],
  encapsulation: ViewEncapsulation.None,
  styles: `
    ${selector} {
      .watt-sidenav-content {
        width: 100vw;
        margin: 0 !important;

        @media (min-width: 1280px) {
          left: 245px;
        }
      }

      .logo-container {
        height: var(--watt-space-xl);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 var(--watt-space-m);
      }

      .logo {
        width: 80%;
      }

      .icon-link {
        display: flex;
        align-items: center;
        gap: var(--watt-space-s);
      }

      .content {
        padding: var(--watt-space-m);
      }
    }
  `,
  template: `
    <watt-shell>
      <ng-container watt-shell-sidenav>
        <div class="logo-container">
          <img class="logo" src="/assets/images/energy-origin-logo-secondary.svg" />
        </div>
        <watt-nav-list #navList>
          @for(link of links; track link.src) {
            <watt-nav-list-item [link]="link.src">{{ link.title }}</watt-nav-list-item>
          }
        </watt-nav-list>

        <br />

        <watt-nav-list>
          <watt-nav-list-item [link]="devPortalHref" (click)="gotoDevPortal($event)">
            <span class="icon-link">
              <watt-icon name="openInNew" />
              {{ translations.documentation.endpoints | transloco }}
            </span>
          </watt-nav-list-item>
        </watt-nav-list>
      </ng-container>

      <ng-container watt-shell-toolbar>{{ translations.documentation.topbarTitle | transloco }}</ng-container>

      <div class="content">
        <router-outlet />
      </div>
    </watt-shell>
  `,
})
export class EoApiDocumentationComponent {
  private transloco = inject(TranslocoService);
  private activeLang = this.transloco.getActiveLang();
  private docs = inject(eoApiEnvironmentToken).documentation;

  protected translations = translations;
  protected afterViewInit = signal<boolean>(false);
  protected devPortalHref: string = inject(eoApiEnvironmentToken).developerPortal;
  protected links = this.docs.map((doc) => ({ title: doc.title, src: '/' + this.activeLang + '/documentation/' + doc.id }));

  gotoDevPortal(event: Event) {
    event.preventDefault();
    window.location.assign(this.devPortalHref);
  }
}
