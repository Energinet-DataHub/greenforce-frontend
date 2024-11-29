import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { WattBreakpoint } from './breakpoints';

export interface WattBreakpointState {
  /** Whether the breakpoint is currently matching. */
  matches: boolean;
  /**
   * A key boolean pair for each query provided to the observe method,
   * with its current matched state.
   */
  breakpoints: {
    [key in WattBreakpoint]?: boolean;
  };
}

@Injectable({ providedIn: 'root' })
export class WattBreakpointsObserver {
  constructor(private breakpointObserver: BreakpointObserver) {}

  observe(breakpoints: WattBreakpoint | WattBreakpoint[]): Observable<WattBreakpointState> {
    return this.breakpointObserver.observe(breakpoints);
  }

  isMatched(breakpoint: WattBreakpoint): boolean {
    return this.breakpointObserver.isMatched(breakpoint);
  }
}
