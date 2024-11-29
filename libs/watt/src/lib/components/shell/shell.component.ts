import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, switchMap, first } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattBreakpoint, WattBreakpointsObserver } from '../../foundations/breakpoints';
import { WattButtonComponent } from '../button';

@Component({
  selector: 'watt-shell',
  styleUrls: ['./shell.component.scss'],
  templateUrl: './shell.component.html',
  standalone: true,
  imports: [AsyncPipe, MatSidenavModule, MatToolbarModule, WattButtonComponent],
})
export class WattShellComponent implements OnInit {
  private breakpointObserver = inject(WattBreakpointsObserver);
  private router = inject(Router);
  /**
   * @ignore
   */
  private _destroyRef = inject(DestroyRef);

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

  ngOnInit(): void {
    this.closeSidenavOnNavigation();
  }

  private closeSidenavOnNavigation(): void {
    this.onNavigationEnd$
      .pipe(
        switchMap(() => this.isHandset$.pipe(first())),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((isHandset) => {
        if (isHandset && this.sidenav && this.sidenav.opened) {
          this.sidenav.close();
        }
      });
  }
}
