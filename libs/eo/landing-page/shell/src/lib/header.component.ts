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
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  WritableSignal,
  afterNextRender,
  inject,
} from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoPipe } from '@jsverse/transloco';
import { distinctUntilChanged, filter, fromEvent, map, pairwise, throttleTime } from 'rxjs';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { translations } from '@energinet-datahub/eo/translations';
import { EoProductLogoDirective } from '@energinet-datahub/eo/shared/components/ui-product-logo';
import { EoLanguageSwitcherComponent } from '@energinet-datahub/eo/globalization/feature-language-switcher';

import { EoAnnouncementBarComponent } from './announcement-bar.component';
import { EoLoginButtonComponent } from './login-button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WattButtonComponent,
    EoAnnouncementBarComponent,
    TranslocoPipe,
    EoProductLogoDirective,
    EoLanguageSwitcherComponent,
    TranslocoPipe,
    EoLoginButtonComponent,
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
      <img eoProductLogo version="secondary" class="logo secondary" style="margin-top: -6px" />
      <img eoProductLogo class="logo primary" />

      <div class="actions">
        <eo-login-button type="text" />

        <!-- We defer the language picker to avoid loading dayjs locales on initial load -->
        @defer (on viewport; prefetch on idle) {
          <eo-language-switcher
            (click)="pauseScrollEvents = true"
            (closed)="pauseScrollEvents = false"
            [changeUrl]="true"
          >
            <watt-button variant="text" icon="language" />
          </eo-language-switcher>
        } @placeholder {
          <watt-button variant="text" icon="language" />
        }
      </div>
    </div>
  `,
})
export class EoLandingPageHeaderComponent {
  private readonly elementRef = inject(ElementRef);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly destroyRef = inject(DestroyRef);

  protected translations = translations;
  protected pauseScrollEvents = false;
  protected isLoggedIn!: WritableSignal<boolean>;

  constructor() {
    afterNextRender(() => {
      this.init();
    });
  }

  init(): void {
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
