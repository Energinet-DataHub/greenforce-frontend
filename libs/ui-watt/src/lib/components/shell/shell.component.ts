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
import { Component } from '@angular/core';
import { map, shareReplay } from 'rxjs';

import {
  WattBreakpointsObserver,
  WattBreakpoint,
} from '../../foundations/breakpoints';

@Component({
  selector: 'watt-shell',
  styleUrls: ['./shell.component.scss'],
  templateUrl: './shell.component.html',
})
export class WattShellComponent {
  /**
   * @ignore
   */
  shouldAutoFocus = false;

  /**
   * @ignore
   */
  isHandset$ = this.breakpointObserver
    .observe([
      WattBreakpoint.XSmall,
      WattBreakpoint.Small,
      WattBreakpoint.Medium,
    ])
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: WattBreakpointsObserver) {}
}
