import { Component, ElementRef, HostBinding, NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'a[watt-nav-list-item]',
  exportAs: 'wattNavListItem',
  templateUrl: './watt-nav-list-item.component.html',
})
export class WattNavListItemComponent {
  @HostBinding('class') get baseClass() {
    return 'mat-list-item mat-focus-indicator';
  }

  constructor(private element: ElementRef<HTMLElement>) {}

  /** Retrieves the DOM element of the component host. */
  getHostElement(): HTMLElement {
    return this.element.nativeElement;
  }
}

@NgModule({
  declarations: [WattNavListItemComponent],
  exports: [WattNavListItemComponent],
  imports: [MatRippleModule],
})
export class WattNavListItemScam {}
