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
import { Router, NavigationEnd } from '@angular/router';
import { Component, inject, viewChild } from '@angular/core';

import { filter, map } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';

import { WattButtonComponent } from '@energinet/watt/button';
import { WattBreakpointsObserver } from '@energinet/watt/core/breakpoints';

@Component({
  selector: 'watt-shell',
  styleUrls: ['./shell.component.scss'],
  templateUrl: './shell.component.html',
  imports: [MatSidenavModule, MatToolbarModule, WattButtonComponent],
})
export class WattShellComponent {
  private breakpointObserver = inject(WattBreakpointsObserver);
  private router = inject(Router);
  private readonly sidenav = viewChild.required<MatSidenav>('drawer');

  /**
   * @ignore
   */
  private onNavigationEnd$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd)
  );

  /**
   * @ignore
   */
  isHandset = toSignal(
    this.breakpointObserver
      .observe(['XSmall', 'Small', 'Medium'])
      .pipe(map((result) => result.matches))
  );

  constructor() {
    this.onNavigationEnd$.pipe(takeUntilDestroyed()).subscribe(() => {
      const sidenav = this.sidenav();
      if (this.isHandset() && sidenav.opened) {
        sidenav.close();
      }
    });
  }
}
