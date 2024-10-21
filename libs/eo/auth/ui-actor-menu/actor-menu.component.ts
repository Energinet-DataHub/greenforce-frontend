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
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoPipe } from '@ngneat/transloco';
import { NgClass } from '@angular/common';

import { EoScrollViewComponent } from '@energinet-datahub/eo/shared/components/ui-scroll-view';
import { Actor } from '@energinet-datahub/eo/auth/domain';
import { translations } from '@energinet-datahub/eo/translations';
import { WattIconComponent } from '@energinet-datahub/watt/icon';

const selector = 'eo-actor-menu';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [TranslocoPipe, MatMenuModule, NgClass, EoScrollViewComponent, WattIconComponent],
  selector,
  styles: `
    @use '@energinet-datahub/watt/utils' as watt;

    ${selector} .menu-trigger {
      cursor: pointer;
      pointer-events: none;

      watt-icon {
        display: none;
      }

      &.has-actors {
        position: relative;
        pointer-events: auto;
        watt-icon {
          display: flex;
          color: #fff;
          transition: transform 0.2s linear;
          position: absolute;
          top: 50%;
          right: 8px;
          transform: translate3d(0, -50%, 0);
        }

        &[aria-expanded='true'] watt-icon {
          transform: translate3d(0, -50%, 0) rotate(180deg);
        }
      }
      background-color: var(--watt-on-light-low-emphasis);
      border-radius: 8px;
      margin: var(--watt-space-s);
      padding: var(--watt-space-s) var(--watt-space-m);

      .watt-label {
        color: var(--watt-on-dark-high-emphasis);

        &.on-behalf-of {
          color: var(--watt-on-dark-medium-emphasis);
          @include watt.typography-font-size('xs');
          @include watt.typography-font-weight('semibold');
        }
      }
    }

    .actor-menu-panel {
      --mat-menu-container-shape: 0;
      --eo-scroll-view-padding: 0;
      --eo-scroll-view-max-height: 112px;
      width: 257px;
      margin-bottom: var(--watt-space-s);
      transition: width 0.2s linear;

      @include watt.media('>Small') {
        width: 312px;
      }

      .mat-mdc-menu-item-text {
        width: 100%;
      }

      .menu-header {
        padding: 4px 14px;
        font-weight: 300;

        &.other-organizations {
          border-top: 1px solid var(--watt-color-neutral-grey-300);
          margin-top: 12px;
          padding-top: 14px;
        }
      }

      .actor {
        display: flex;
        flex-direction: column;

        &__tin,
        &__name {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        &__tin {
          color: var(--watt-on-light-high-emphasis);
        }

        &__name {
          color: var(--watt-on-light-medium-emphasis);
        }
      }
    }
  `,
  template: `
    @if (self() && currentActor()) {
      <div
        [matMenuTriggerFor]="menu"
        class="menu-trigger"
        [ngClass]="{ 'has-actors': actors().length > 0 }"
      >
        @if (currentActor()?.org_id !== self()?.org_id) {
          <p class="watt-label on-behalf-of">
            {{ translations.actorMenu.onBehalfOf | transloco: { org_name: self()?.org_name } }}
          </p>
        }
        <p class="watt-label">
          {{ translations.actorMenu.tin | transloco: { tin: currentActor()?.tin } }}
        </p>
        <p class="watt-label">{{ currentActor()?.org_name }}</p>

        <watt-icon name="down" size="s" />
      </div>
      <mat-menu #menu="matMenu" class="actor-menu-panel">
        @if (self()?.org_id !== currentActor()?.org_id) {
          <p class="menu-header">
          {{ translations.actorMenu.ownOrganization | transloco }}
          </p>
          <button mat-menu-item (click)="selectActor()">
            <div class="actor">
              <small class="actor__tin">{{ self()?.tin }}</small>
              <small class="actor__name">{{ self()?.org_name }}</small>
            </div>
          </button>
        }

        @if (self()?.org_id !== currentActor()?.org_id) {
          <p class="menu-header other-organizations">
            {{ translations.actorMenu.otherOrganizations | transloco }}
          </p>
        }
        <eo-scroll-view>
          @for (actor of actors(); track $index) {
            @if (actor.org_id !== currentActor()?.org_id && actor.org_id !== self()?.org_id) {
              <button mat-menu-item (click)="selectActor(actor)">
                <div class="actor">
                  <small class="actor__tin">{{ actor.tin }}</small>
                  <small class="actor__name">{{ actor.org_name }}</small>
                </div>
              </button>
            }
          }
        </eo-scroll-view>
      </mat-menu>
    }
  `,
})
export class EoActorMenuComponent {
  actors = input<Actor[]>([]);
  currentActor = input.required<Actor | null>();
  self = input.required<Actor | null>();

  actorSelected = output<Actor>();

  protected translations = translations;

  selectActor(actor?: Actor) {
    // Wait to emit the selection until the menu has closed
    setTimeout(() => {
      this.actorSelected.emit(actor ?? (this.self() as Actor));
    }, 150);
  }
}
