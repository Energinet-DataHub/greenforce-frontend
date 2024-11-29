import { Directive, AfterViewInit, Input, QueryList, inject } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { from, filter, mergeMap } from 'rxjs';

import { WattNavListItemComponent } from './watt-nav-list-item.component';
import { outputToObservable } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[wattExpandOnActiveLink]',
  exportAs: 'wattExpandOnActiveLink',
  standalone: true,
})
export class WattExpandOnActiveLinkDirective implements AfterViewInit {
  private panel = inject(MatExpansionPanel);
  @Input() wattNavListItemComponents: QueryList<WattNavListItemComponent> | null = null;

  ngAfterViewInit(): void {
    const navListItems = this.wattNavListItemComponents?.toArray();

    if (navListItems) {
      from(navListItems)
        .pipe(
          mergeMap((item) => outputToObservable(item.isActive)),
          filter((isActive) => isActive)
        )
        .subscribe(() => {
          this.panel.open();
        });
    }
  }
}
