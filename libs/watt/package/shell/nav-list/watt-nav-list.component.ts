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
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  contentChildren,
  effect,
  input,
  signal,
} from '@angular/core';

import { WattIconComponent } from '@energinet/watt/icon';

import { WattNavListItemComponent } from './watt-nav-list-item.component';

let uniqueId = 0;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-nav-list',
  styleUrl: './watt-nav-list.component.scss',
  host: {
    '[class.watt-nav-list--expandable]': 'expandable()',
  },
  template: `
    @if (expandable()) {
      <button
        type="button"
        class="watt-nav-list__header"
        [class.watt-nav-list__header--expanded]="isExpanded()"
        [id]="headerId"
        [attr.aria-expanded]="isExpanded()"
        [attr.aria-controls]="bodyId"
        (click)="toggle()"
      >
        <span class="watt-text-m">{{ title() }}</span>
        <watt-icon name="down" class="watt-nav-list__chevron" />
      </button>
      <div
        class="watt-nav-list__body"
        role="region"
        [id]="bodyId"
        [attr.aria-labelledby]="headerId"
        [class.watt-nav-list__body--expanded]="isExpanded()"
        [attr.inert]="isExpanded() ? null : true"
      >
        <div class="watt-nav-list__body-inner">
          <ng-container *ngTemplateOutlet="navListTemplate" />
        </div>
      </div>
    } @else {
      <ng-container *ngTemplateOutlet="navListTemplate" />
    }

    <ng-template #navListTemplate>
      <ng-content />
    </ng-template>
  `,
  imports: [NgTemplateOutlet, WattIconComponent],
})
export class WattNavListComponent {
  /** @ignore */
  navListItems = contentChildren(WattNavListItemComponent);

  expandable = input(false);
  title = input('');

  /** @ignore */
  readonly headerId = `watt-nav-list-header-${uniqueId++}`;
  /** @ignore */
  readonly bodyId = `watt-nav-list-body-${uniqueId++}`;

  private readonly expanded = signal(false);

  /** @ignore */
  readonly isExpanded = this.expanded.asReadonly();

  constructor() {
    effect((cleanup) => {
      const subs = this.navListItems().map((item) =>
        item.isActive.subscribe((active) => {
          if (active) this.expanded.set(true);
        })
      );
      cleanup(() => subs.forEach((sub) => sub.unsubscribe()));
    });
  }

  /** @ignore */
  toggle() {
    this.expanded.update((v) => !v);
  }
}
