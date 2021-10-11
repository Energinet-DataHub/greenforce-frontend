import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { WattBreakpoints } from '@energinet-datahub/watt';
import { Observable } from 'rxjs';

export interface WattBreakpointState {
  /** Whether the breakpoint is currently matching. */
  matches: boolean;
  /**
   * A key boolean pair for each query provided to the observe method,
   * with its current matched state.
   */
  breakpoints: {
    [key in WattBreakpoints]?: boolean;
  };
}

@Injectable({ providedIn: 'root' })
export class WattBreakpointsObserver {
  constructor(
    private breakpointObserver: BreakpointObserver,
  ) {}

  observe(
    breakpoints: WattBreakpoints | WattBreakpoints[]
  ): Observable<WattBreakpointState> {
    return this.breakpointObserver.observe(breakpoints);
  }

  isMatched(breakpoint: WattBreakpoints) {
    this.breakpointObserver.isMatched(breakpoint);
  }
}
