import { Component, ViewEncapsulation, contentChildren } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { WattLinkTabComponent } from './watt-link-tab.component';

@Component({
  standalone: true,
  selector: 'watt-link-tabs',
  encapsulation: ViewEncapsulation.None,
  imports: [MatTabsModule, RouterOutlet, RouterLink, RouterLinkActive],
  styles: `
    @use '@energinet-datahub/watt/utils' as watt;
    .mat-mdc-tab-header {
      box-shadow: var(--watt-bottom-box-shadow);
      background-color: var(--watt-color-neutral-white);
    }

    .mat-mdc-tab-nav-panel {
      display: block;
      padding: var(--watt-space-ml);
    }

    .mat-mdc-tab-links,
    .mat-mdc-focus-indicator.mat-mdc-tab-link.active .mdc-tab__text-label {
      color: var(--mat-tab-header-active-label-text-color);
    }

    .mat-mdc-tab-labels,
    .mat-mdc-tab-links {
      padding-left: var(--watt-space-ml);
    }

    .mat-mdc-tab,
    .mat-mdc-tab-link {
      min-width: 120px;
      opacity: 1;

      .mdc-tab__content {
        @include watt.typography-watt-button;
        color: var(--watt-on-light-medium-emphasis);
      }

      &.mat-mdc-tab-active,
      &.mat-mdc-tab-link.active {
        border-bottom: 2px solid var(--watt-color-primary);
      }
      &.mat-mdc-tab:hover,
      &.mat-mdc-tab-link:hover {
        border-bottom: 2px solid var(--watt-color-primary);
      }

      &.mat-mdc-tab-active,
      &.mat-mdc-tab-link.active,
      &.mat-mdc-tab:hover,
      &.mat-mdc-tab-link:hover {
        color: var(--watt-on-light-medium-emphasis);

        .mdc-tab__content {
          color: var(--watt-color-primary);
        }
      }
    }
  `,
  template: `<nav
      mat-tab-nav-bar
      [disableRipple]="true"
      animationDuration="0ms"
      [mat-stretch-tabs]="false"
      [tabPanel]="tabPanel"
    >
      @for (tab of tabElements(); track tab) {
        <a mat-tab-link routerLink="{{ tab.link() }}" routerLinkActive="active">
          {{ tab.label() }}
        </a>
      }
    </nav>

    <mat-tab-nav-panel #tabPanel>
      <router-outlet />
    </mat-tab-nav-panel>`,
})
export class WattLinkTabsComponent {
  tabElements = contentChildren(WattLinkTabComponent);
}
