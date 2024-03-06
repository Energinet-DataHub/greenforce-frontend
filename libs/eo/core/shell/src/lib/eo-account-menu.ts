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
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatMenuModule } from '@angular/material/menu';

import { EoAuthStore } from '@energinet-datahub/eo/shared/services';
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

      watt-button, .mdc-button {
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
    @if (user()?.name; as name) {
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
  private authStore = inject(EoAuthStore);

  protected user = toSignal(this.authStore.getUserInfo$);
  protected isOpen = signal<boolean>(false);
}
