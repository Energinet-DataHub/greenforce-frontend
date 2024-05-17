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
  ContentChild,
  Directive,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { MatAccordionTogglePosition, MatExpansionModule } from '@angular/material/expansion';

@Directive({
  standalone: true,
  selector: '[wattExpandableCardContent]',
})
export class WattExpandableCardContentDirective {
  templateRef = inject(TemplateRef);
}

/**
 * Usage:
 * `import { WATT_EXPANDABLE_CARD_COMPONENTS } from '@energinet-datahub/watt/expandable-card';`
 */
@Component({
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, MatExpansionModule],
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-expandable-card',
  styleUrl: './watt-expandable-card.component.scss',
  templateUrl: './watt-expandable-card.component.html',
})
export class WattExpandableCardComponent {
  /**
   * @ignore
   */
  @ContentChild(WattExpandableCardContentDirective)
  _content?: WattExpandableCardContentDirective;

  /**
   * @ignore
   */
  @ContentChild(WattExpandableCardComponent)
  containsNestedCard?: WattExpandableCardComponent;

  /** Whether the card is expanded. */
  @Input() expanded = false;

  /** The position of the expansion indicator. */
  @Input() togglePosition: MatAccordionTogglePosition = 'after';

  /** Whether the card is elevated or has solid border */
  @Input() variant: 'solid' | 'elevation' = 'elevation';

  /** Emitted when card is opened */
  @Output() cardOpened = new EventEmitter<void>();
  /** Emitted when after card was expanded */
  @Output() afterExpanded = new EventEmitter<void>();

  opened() {
    this.cardOpened.emit();
  }

  afterExpand() {
    this.afterExpanded.emit();
  }
}

@Component({
  standalone: true,
  selector: 'watt-expandable-card-title',
  template: `<ng-content />`,
})
export class WattExpandableCardTitleComponent {}

export const WATT_EXPANDABLE_CARD_COMPONENTS = [
  WattExpandableCardComponent,
  WattExpandableCardTitleComponent,
  WattExpandableCardContentDirective,
] as const;
