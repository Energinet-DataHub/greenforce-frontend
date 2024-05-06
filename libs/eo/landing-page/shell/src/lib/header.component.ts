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
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
} from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@ngneat/transloco';
import { distinctUntilChanged, filter, fromEvent, map, pairwise, throttleTime } from 'rxjs';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { EoAuthService } from '@energinet-datahub/eo/shared/services';
import { translations } from '@energinet-datahub/eo/translations';
import { EoProductLogoDirective } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { EoLanguageSwitcherComponent } from '@energinet-datahub/eo/globalization/feature-language-switcher';

import { EoAnnouncementBarComponent } from './announcement-bar.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    WattButtonComponent,
    EoAnnouncementBarComponent,
    TranslocoPipe,
    EoProductLogoDirective,
    EoLanguageSwitcherComponent,
    TranslocoPipe,
  ],
  selector: 'eo-landing-page-header',
  styles: `
    :host {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 100;

      --watt-button-color: #fff;
      --watt-button-text-hover-color: #ee9331;
      --watt-button-text-focus-color: #ee9331;
      --watt-button-text-transform: uppercase;

      &:not(.sticky) .logo.secondary {
        display: block;
      }

      &.sticky {
        position: fixed;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        --watt-button-color: #01857d;
        transform: translate3d(0, -100%, 0);

        &.show {
          transition: transform 0.25s linear;
          transform: translate3d(0, 0, 0);
        }

        .logo.primary {
          display: block;
        }

        .topbar {
          padding-top: 0;
          padding-bottom: 0;
          background-color: #fff;
        }
      }
    }

    .topbar {
      padding: 24px clamp(16px, 5vw, 99px);
      display: flex;
      justify-content: space-between;
    }

    .logo {
      width: 150px;
      height: 44px;
      display: none;
    }
  `,
  template: `
    <eo-announcement-bar
      [announcement]="translations.landingPage.announcementBar.message | transloco"
    />
    <div class="topbar">
      <img eoProductLogo version="secondary" class="logo secondary" />
      <img eoProductLogo class="logo primary" />

      <div class="actions">
        <watt-button variant="text" class="login" data-testid="login-button" (click)="login()">
          {{ translations.landingPage.header.loginButton | transloco }}
        </watt-button>
        <eo-language-switcher
          (click)="pauseScrollEvents = true"
          (closed)="pauseScrollEvents = false"
        >
          <watt-button variant="text" icon="language" />
        </eo-language-switcher>
      </div>
    </div>
  `,
})
export class EoLandingPageHeaderComponent implements AfterViewInit {
  private authService = inject(EoAuthService);
  private elementRef = inject(ElementRef);
  private viewportScroller = inject(ViewportScroller);
  private destroyRef = inject(DestroyRef);
  protected translations = translations;
  protected pauseScrollEvents = false;

  login() {
    this.authService.startLogin();
  }

  ngAfterViewInit(): void {
    // ADD / REMOVE STICKY MODE
    fromEvent(window, 'scroll')
      .pipe(
        filter(() => !this.pauseScrollEvents),
        takeUntilDestroyed(this.destroyRef),
        map(() => this.viewportScroller.getScrollPosition()[1]),
        distinctUntilChanged()
      )
      .subscribe((scrollY) => {
        if (scrollY <= this.elementRef.nativeElement.getBoundingClientRect().height) {
          this.elementRef.nativeElement.classList.remove('sticky');
        } else if (scrollY > this.elementRef.nativeElement.getBoundingClientRect().height) {
          this.elementRef.nativeElement.classList.add('sticky');
        }
      });

    // SHOW / HIDE HEADER
    fromEvent(window, 'scroll')
      .pipe(
        filter(() => !this.pauseScrollEvents),
        takeUntilDestroyed(this.destroyRef),
        map(() => this.viewportScroller.getScrollPosition()[1]),
        throttleTime(150),
        pairwise(),
        distinctUntilChanged()
      )
      .subscribe(([prev, curr]) => {
        if (prev > curr && this.elementRef.nativeElement.classList.contains('sticky')) {
          this.elementRef.nativeElement.classList.add('show');
        } else {
          this.elementRef.nativeElement.classList.remove('show');
        }
      });
  }
}
