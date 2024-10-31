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
import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { WattDescriptionListItemComponent } from './watt-description-list-item.component';
/**
 * Usage:
 * `import { WattDescriptionListComponent } from '@energinet-datahub/watt/description-list';`
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-description-list',
  styleUrls: ['./watt-description-list.component.scss'],
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `<dl>
    @for (item of descriptionItems(); track item) {
      <ng-container *ngTemplateOutlet="item.templateRef()" />
    }
  </dl>`,
  hostDirectives: [NgClass],
  host: {
    '[style.--watt-description-list-groups-per-row]': 'groupsPerRow()',
    '[class]': 'descriptionVariant()',
  },
})
class WattDescriptionListComponent<T> {
  private ngClass = inject(NgClass);
  descriptionItems = contentChildren(WattDescriptionListItemComponent<T>);
  variant = input<'flow' | 'stack'>('flow');
  descriptionVariant = computed(() => `watt-description-list-${this.variant()}`);
  groupsPerRow = input<number>(3);
  itemSeparators = input(true);

  constructor() {
    effect(() => {
      this.ngClass.ngClass = {
        [`itemSeparators`]: this.itemSeparators(),
      };
    });
  }
}

export { WattDescriptionListItemComponent, WattDescriptionListComponent };
