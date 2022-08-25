import {
  Directive,
  AfterViewInit,
  OnInit,
  Input,
  QueryList,
  ChangeDetectorRef,
} from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { from, mergeAll, filter } from 'rxjs';

import { WattNavListItemComponent } from './watt-nav-list-item.component';

@Directive({
  selector: '[wattExpandOnActiveLink]',
  exportAs: 'wattExpandOnActiveLink',
  standalone: true,
})
export class WattExpandOnActiveLinkDirective implements AfterViewInit, OnInit {
  public expand = false;

  @Input()
  wattNavListItemComponents: QueryList<WattNavListItemComponent> | null = null;

  constructor(
    private panel: MatExpansionPanel,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.panel.afterCollapse.subscribe(() => {
      this.expand = false;
    });
  }

  ngAfterViewInit(): void {
    const navListItems = this.wattNavListItemComponents?.toArray();

    if (navListItems) {
      const links$ = navListItems.map((item) => item.isActive$);

      from(links$)
        .pipe(
          mergeAll(),
          filter((isActive) => isActive)
        )
        .subscribe((isActive) => {
          this.expand = isActive;
          this.cdr.markForCheck();
        });
    }
  }
}
