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
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, Subject, switchMap, takeUntil, first } from 'rxjs';

import { WattBreakpoint, WattBreakpointsObserver } from '../../foundations/breakpoints';
import { WattButtonModule } from '../button';

@Component({
  selector: 'watt-shell',
  styleUrls: ['./shell.component.scss'],
  templateUrl: './shell.component.html',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatToolbarModule, WattButtonModule],
})
export class WattShellComponent implements OnInit, OnDestroy {
  /**
   * @ignore
   */
  private destroy$ = new Subject<void>();

  /**
   * @ignore
   */
  shouldAutoFocus = false;

  /**
   * @ignore
   */
  private onNavigationEnd$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd)
  );

  /**
   * @ignore
   */
  isHandset$ = this.breakpointObserver
    .observe([WattBreakpoint.XSmall, WattBreakpoint.Small, WattBreakpoint.Medium])
    .pipe(map((result) => result.matches));

  @ViewChild('drawer') sidenav!: MatSidenav;

  constructor(private breakpointObserver: WattBreakpointsObserver, private router: Router) {}

  ngOnInit(): void {
    this.closeSidenavOnNavigation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private closeSidenavOnNavigation(): void {
    this.onNavigationEnd$
      .pipe(
        switchMap(() => this.isHandset$.pipe(first())),
        takeUntil(this.destroy$)
      )
      .subscribe((isHandset) => {
        if (isHandset && this.sidenav && this.sidenav.opened) {
          this.sidenav.close();
        }
      });
  }
}
