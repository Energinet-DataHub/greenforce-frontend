import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';

import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattIconComponent } from '@energinet-datahub/watt/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatMenuModule, WattButtonComponent, WattIconComponent, NgClass],
  selector: 'eo-account-menu',
  styles: `
    @use '@energinet-datahub/watt/utils' as watt;

    .mat-mdc-menu-panel.account-menu {
      min-width: 270px;
      overflow: hidden;

      .mat-mdc-menu-content > * {
        width: 100%;
      }

      watt-button,
      .mdc-button {
        width: 100%;
      }

      button {
        color: var(--watt-on-light-high-emphasis) !important;
        justify-content: flex-start;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
      }

      hr {
        height: 1px;
        background-color: var(--watt-color-neutral-grey-200);
        border: none;
      }
    }

    eo-account-menu {
      .menu-icon {
        transition: transform 150ms;

        &.isOpen {
          transform: rotate(180deg);
        }
      }

      .hide-on-small {
        @include watt.media('<=Small') {
          display: none;
        }
      }

      .show-on-small-only {
        @include watt.media('>Small') {
          display: none;
        }
      }
    }
  `,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (user()?.profile?.name; as name) {
      <watt-button [matMenuTriggerFor]="menu" variant="text" (click)="isOpen.set(true)">
        <span
          style="color: var(--watt-on-light-high-emphasis); font-size: 14px; line-height: 20px;"
          class="hide-on-small"
        >
          {{ name }}
        </span>
        <watt-icon name="down" class="menu-icon hide-on-small" [ngClass]="{ isOpen: isOpen() }" />
        <watt-icon class="show-on-small-only" name="account" />
      </watt-button>

      <mat-menu
        #menu="matMenu"
        xPosition="before"
        class="account-menu"
        (closed)="isOpen.set(false)"
      >
        <ng-content />
      </mat-menu>
    }
  `,
})
export class EoAccountMenuComponent {
  protected user = inject(EoAuthService).user;
  protected isOpen = signal<boolean>(false);
}
