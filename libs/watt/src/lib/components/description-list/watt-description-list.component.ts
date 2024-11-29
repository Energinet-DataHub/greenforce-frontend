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
        [`item-separators`]: this.itemSeparators(),
      };
    });
  }
}

export { WattDescriptionListItemComponent, WattDescriptionListComponent };
