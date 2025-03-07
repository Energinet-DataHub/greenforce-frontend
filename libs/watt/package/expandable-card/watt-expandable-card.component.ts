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
  Component,
  Directive,
  TemplateRef,
  ViewEncapsulation,
  inject,
  input,
  contentChild,
} from '@angular/core';
import { MatAccordionTogglePosition, MatExpansionModule } from '@angular/material/expansion';

@Directive({
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
  imports: [NgTemplateOutlet, MatExpansionModule],
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-expandable-card',
  styleUrl: './watt-expandable-card.component.scss',
  template: `
    <mat-expansion-panel
      [togglePosition]="togglePosition()"
      [expanded]="expanded()"
      class="watt-expandable-card watt-{{ variant() }}"
      [class.watt-expandable-card__parent]="containsNestedCard()"
    >
      <mat-expansion-panel-header>
        <mat-panel-title>
          <ng-content select="watt-badge" />
          <ng-content select="watt-expandable-card-title" />
        </mat-panel-title>
      </mat-expansion-panel-header>

      <ng-content />

      @let _cardContent = cardContent();

      @if (_cardContent) {
        <ng-template matExpansionPanelContent>
          <ng-container *ngTemplateOutlet="_cardContent.templateRef" />
        </ng-template>
      }
    </mat-expansion-panel>
  `,
})
export class WattExpandableCardComponent {
  /**
   * @ignore
   */
  cardContent = contentChild(WattExpandableCardContentDirective);

  /**
   * @ignore
   */
  containsNestedCard = contentChild(WattExpandableCardComponent);

  /** Whether the card is expanded. */
  expanded = input(false);

  /** The position of the expansion indicator. */
  togglePosition = input<MatAccordionTogglePosition>('after');

  /** Whether the card is elevated or has solid border */
  variant = input<'solid' | 'elevation'>('elevation');
}

@Component({
  selector: 'watt-expandable-card-title',
  template: `<ng-content />`,
})
export class WattExpandableCardTitleComponent {}
