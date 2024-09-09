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
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoPipe } from '@ngneat/transloco';

import { translations } from '@energinet-datahub/eo/translations';
import { NgClass } from '@angular/common';

export interface Actor {
  name?: string;
  org_name?: string;
  tin?: string;
  isSelf?: boolean; // is the user the actor, or acting on behalf of the actor
}

const selector = 'eo-actor-menu';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [TranslocoPipe, MatMenuModule, NgClass],
  selector,
  styles: `
    @use '@energinet-datahub/watt/utils' as watt;

    ${selector} .menu-trigger {
      cursor: pointer;
      pointer-events: none;
      &.has-actors {
        pointer-events: auto;
      }
      background-color: var(--watt-on-light-low-emphasis);
      border-radius: 8px;
      margin: var(--watt-space-m);
      padding: var(--watt-space-s) var(--watt-space-m);

      .watt-label {
        color: var(--watt-on-dark-high-emphasis);

        &.company-name {
          color: var(--watt-on-dark-medium-emphasis);
        }
      }
    }

    .actor-menu-panel {
      --mat-menu-container-shape: 0;
      width: 257px;
      margin-bottom: var(--watt-space-s);
      transition: width 0.2s linear;

      @include watt.media('>Small') {
        width: 312px;
      }

      .mat-mdc-menu-item-text {
        width: 100%;
      }

      .actor {
        display: flex;
        flex-direction: column;

        &__tin, &__name {
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
    <!-- TODO: Add loading state -->
    <div [matMenuTriggerFor]="menu" class="menu-trigger" [ngClass]="{'has-actors': actors.length > 0}">
      <p class="watt-label company-name">{{ currentActor.org_name }}</p>
      <p class="watt-label">
        {{ translations.userInformation.tin | transloco: { tin: currentActor.tin } }}
      </p>
      <p class="watt-label">{{ currentActor.name }}</p>
    </div>
    <mat-menu #menu="matMenu" class="actor-menu-panel">
      @for (actor of actors; track $index) {
        <button mat-menu-item (click)="selectActor(actor)">
          <div class="actor">
            <small class="actor__tin">{{ actor.tin }}</small>
            <small class="actor__name">{{ actor.name }}</small>
          </div>
        </button>
      }
    </mat-menu>
  `,
})
export class EoActorMenuComponent {
  @Input() actors: Actor[] = [];
  @Input() currentActor!: Actor;

  @Output() actorSelected = new EventEmitter<Actor>();

  protected translations = translations;

  selectActor(actor: Actor) {
    this.actorSelected.emit(actor);
  }
}
