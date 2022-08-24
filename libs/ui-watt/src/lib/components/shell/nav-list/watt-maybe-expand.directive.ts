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
  selector: '[wattMaybeExpand]',
  exportAs: 'wattMaybeExpand',
  standalone: true,
})
export class WattMaybeExpandDirective implements AfterViewInit, OnInit {
  public expand = false;

  @Input() wattMaybeExpand?: QueryList<WattNavListItemComponent>;

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
    const listItems: WattNavListItemComponent[] | undefined =
      this.wattMaybeExpand?.toArray();

    if (listItems) {
      const activeLinks$ = [...listItems].map((item) => item.isActive$);

      from(activeLinks$)
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
