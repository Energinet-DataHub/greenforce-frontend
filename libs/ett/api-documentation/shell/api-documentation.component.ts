
import { Component, OnInit, ViewEncapsulation, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { ettApiEnvironmentToken } from '@energinet-datahub/ett/shared/environments';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattNavListComponent, WattNavListItemComponent, WattShellComponent } from '@energinet-datahub/watt/shell';
import { translations } from '@energinet-datahub/ett/translations';
import { CookieInformationCulture, CookieInformationService } from '@energinet-datahub/gf/util-cookie-information';

const selector = 'ett-api-documentation';

@Component({
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
          <img class="logo" src="/assets/images/energy-track-and-trace-logo-secondary.svg" />
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
  `
})
export class EttApiDocumentationComponent implements OnInit{
  private transloco = inject(TranslocoService);
  private activeLang = this.transloco.getActiveLang();
  private cookieInformationService: CookieInformationService = inject(CookieInformationService);
  private docs = inject(ettApiEnvironmentToken).documentation;

  protected translations = translations;
  protected afterViewInit = signal<boolean>(false);
  protected devPortalHref: string = inject(ettApiEnvironmentToken).developerPortal;
  protected links = this.docs.map((doc) => ({ title: doc.title, src: '/' + this.activeLang + '/documentation/' + doc.id }));

  ngOnInit(): void {
    this.cookieInformationService.init({
      culture: this.transloco.getActiveLang() as CookieInformationCulture,
    });
  }

  gotoDevPortal(event: Event) {
    event.preventDefault();
    window.location.assign(this.devPortalHref);
  }
}
