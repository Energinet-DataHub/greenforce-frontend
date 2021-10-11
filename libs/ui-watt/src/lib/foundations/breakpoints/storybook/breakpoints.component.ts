import { Component, OnDestroy } from '@angular/core';
import {
  WattBreakpoints,
  WattBreakpointsObserver,
} from '@energinet-datahub/watt';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'watt-breakpoints',
  templateUrl: './breakpoints.component.html',
  styleUrls: ['./breakpoints.component.scss'],
})
export class WattBreakpointsComponent implements OnDestroy {
  /**
   * @ignore
   */
  destroyed = new Subject<void>();
  /**
   * @ignore
   */
  currentScreenSize!: string;

  /**
   * @ignore
   * Create a map to display breakpoint names for demonstration purposes.
   */
  displayNameMap = new Map([
    [WattBreakpoints.XSmall, 'XSmall'],
    [WattBreakpoints.Small, 'Small'],
    [WattBreakpoints.Medium, 'Medium'],
    [WattBreakpoints.Large, 'Large'],
    [WattBreakpoints.XLarge, 'XLarge'],
  ]);

  constructor(private breakpointsObserver: WattBreakpointsObserver) {
    this.breakpointsObserver
      .observe([
        WattBreakpoints.XSmall,
        WattBreakpoints.Small,
        WattBreakpoints.Medium,
        WattBreakpoints.Large,
        WattBreakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        for (const query of Object.keys(
          result.breakpoints
        ) as WattBreakpoints[]) {
          if (result.breakpoints[query]) {
            this.currentScreenSize =
              this.displayNameMap.get(query) ?? 'Unknown';
          }
        }
      });
  }

  /**
   * @ignore
   */
  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
