import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ContentChild,
  Directive,
  Input,
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
