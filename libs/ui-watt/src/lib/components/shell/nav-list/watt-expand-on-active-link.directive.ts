import { Directive, AfterViewInit, Input, QueryList } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { from, mergeAll, filter } from 'rxjs';

import { WattNavListItemComponent } from './watt-nav-list-item.component';

@Directive({
  selector: '[wattExpandOnActiveLink]',
  exportAs: 'wattExpandOnActiveLink',
  standalone: true,
})
export class WattExpandOnActiveLinkDirective implements AfterViewInit {
  @Input()
  wattNavListItemComponents: QueryList<WattNavListItemComponent> | null = null;

  constructor(private panel: MatExpansionPanel) {}

  ngAfterViewInit(): void {
    const navListItems = this.wattNavListItemComponents?.toArray();

    if (navListItems) {
      const links$ = navListItems.map((item) => item.isActive$);

      from(links$)
        .pipe(
          mergeAll(),
          filter((isActive) => isActive)
        )
        .subscribe(() => {
          this.panel.open();
        });
    }
  }
}
