//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion
import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { WattBreakpoint, WattBreakpointType } from './breakpoints';

export interface WattBreakpointState {
  /** Whether the breakpoint is currently matching. */
  matches: boolean;
  /**
   * A key boolean pair for each query provided to the observe method,
   * with its current matched state.
   */
  breakpoints: {
    [key: string]: boolean;
  };
}

@Injectable({ providedIn: 'root' })
export class WattBreakpointsObserver {
  constructor(private breakpointObserver: BreakpointObserver) {}

  observe(breakpoints: WattBreakpointType | WattBreakpointType[]): Observable<WattBreakpointState> {
    if (Array.isArray(breakpoints)) {
      return this.breakpointObserver.observe(breakpoints.map((bp) => WattBreakpoint[bp]));
    }
    return this.breakpointObserver.observe(WattBreakpoint[breakpoints]);
  }

  isMatched(breakpoint: WattBreakpointType): boolean {
    return this.breakpointObserver.isMatched(WattBreakpoint[breakpoint]);
  }
}
