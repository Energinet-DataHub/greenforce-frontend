import {
  Directive,
  ElementRef,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';

import { WattTooltipComponent } from './watt-tooltip.component';

export type wattTooltipPosition =
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'right'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end'
  | 'left';

export type wattTooltipVariant = 'dark' | 'light';

@Directive({
  selector: '[wattTooltip]',
  standalone: true,
  exportAs: 'wattTooltip',
})
export class WattTooltipDirective implements OnChanges {
  @Input('wattTooltip') text!: string;
  @Input('wattTooltipPosition') position: wattTooltipPosition = 'top';
  @Input('wattTooltipVariant') variant: wattTooltipVariant = 'dark';

  private element: HTMLElement = inject(ElementRef).nativeElement;
  private viewContainerRef = inject(ViewContainerRef);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text']) {
      this.createTooltipComponent();
    }
  }

  private createTooltipComponent() {
    const tooltip =
      this.viewContainerRef.createComponent<WattTooltipComponent>(WattTooltipComponent);
    tooltip.instance.text = this.text;
    tooltip.instance.target = this.element;
    tooltip.instance.position = this.position;
    tooltip.instance.variant = this.variant;

    this.element.setAttribute('aria-describedby', tooltip.instance.id);
  }
}
